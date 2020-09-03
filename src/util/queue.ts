import { Client } from '../clients/client';
import { EventEmitter } from 'events';

export class Queue extends EventEmitter {

    private items : Item[] = [];
    private running = 0;
    private retryTime = 0;

    public constructor(private client: Client) {
        super();
    }

    /**
     * The number of requests in the queue (including requests that are active or waiting).
     */
    public get length() {
        return this.items.length + this.running;
    }

    /**
     * The current concurrency value from the client. This can change at any time.
     */
    private get concurrency() {
        return this.client.options.concurrency || 3;
    }

    /**
     * Registers a rate limit event for the given optional timeframe, thus deferring future requests until the given
     * timeframe passes.
     *
     * @param retryAfter Number of seconds to wait before the next request.
     */
    public registerThrottleEvent(retryAfter ?: number) {
        const duration = (retryAfter || 65) * 1000;
        const deferring = this.isDeferring();
        this.retryTime = this.getTime() + duration;

        // If we weren't deferring before, then emit events
        if (!deferring) {
            this.emit('ratelimit', duration);
            this.defer().then(() => this.emit('resume'));
        }
    }

    /**
     * Returns `true` if we're currently deferring requests.
     */
    public isDeferring() {
        return this.retryTime > this.getTime();
    }

    /**
     * Returns a promise which resolves immediately after a rate limiting event.
     */
    public defer() {
        return new Promise(resolve => {
            const current = this.getTime();
            const remaining = this.retryTime - current;

            if (current > 0) {
                return setTimeout(() => {
                    if (this.isDeferring()) {
                        this.defer().then(resolve);
                    }
                    else {
                        resolve();
                    }
                }, remaining);
            }

            resolve();
        });
    }

    /**
     * Returns the current timestamp in milliseconds.
     */
    private getTime() {
        return (new Date()).getTime();
    }

    /**
     * Adds a new function to the queue. Returns a `Promise` which resolves when the function finishes running, or
     * rejects if the function encounters an error.
     *
     * @param fn The function that will be executed in the queue.
     */
    public push<T>(fn: (resolve: Resolve<T>, reject: Reject, retry: Retry) => any) : Promise<T> {
        return new Promise((resolve, reject) => {
            this.items.push({ fn, resolve, reject });
            this.execute();
        });
    }

    /**
     * Executes the given item, or the next item in line.
     *
     * @param item
     */
    private async execute(item ?: Item) {
        if (item || this.running < this.concurrency || this.concurrency <= 0) {
            let isRetrying = !!item;

            if (!item) {
                item = this.items.shift();
            }

            if (item) {
                // Mark as running
                if (!isRetrying) this.running++;

                // Halt until any existing throttle events have ended
                if (this.isDeferring()) await this.defer();

                // Resolve function (marks the item as complete)
                let resolve = (arg: any) => {
                    item?.resolve(arg);
                    this.running--;
                    this.execute();
                }

                // Reject function (marks the item as failed)
                let reject = (error: Error) => {
                    item?.reject(error);
                    this.running--;
                    this.execute();
                }

                // Retry function (stops the queue and resumes after the specified time)
                let retry = (after: number) => {
                    this.registerThrottleEvent(after);
                    this.execute(item);
                };

                // Execute the callback, catching errors
                try {
                    let response = item.fn(resolve, reject, retry);

                    // Catch rejections in a promise
                    if (typeof response === 'object' && typeof response.catch === 'function') {
                        response.catch(reject);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }
        }
    }

}

interface Item<T = any> {
    fn: (resolve: Resolve<T>, reject: Reject, retry: Retry) => any;
    resolve: (arg ?: T) => void;
    reject: (error: Error) => void;
}

type Resolve<T = any> = (arg: T) => void;
type Reject = (error: Error) => void;
type Retry = (retryAfter ?: number) => void;
