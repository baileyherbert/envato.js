/// <reference types="node" />
import { Client } from '../client';
import { EventEmitter } from 'events';
export declare class Queue extends EventEmitter {
    private client;
    private items;
    private running;
    private retryTime;
    constructor(client: Client);
    /**
     * The number of requests in the queue (including requests that are active or waiting).
     */
    get length(): number;
    /**
     * The current concurrency value from the client. This can change at any time.
     */
    private get concurrency();
    /**
     * Registers a rate limit event for the given optional timeframe, thus deferring future requests until the given
     * timeframe passes.
     *
     * @param retryAfter Number of seconds to wait before the next request.
     */
    registerThrottleEvent(retryAfter?: number): void;
    /**
     * Returns `true` if we're currently deferring requests.
     */
    isDeferring(): boolean;
    /**
     * Returns a promise which resolves immediately after a rate limiting event.
     */
    defer(): Promise<unknown>;
    /**
     * Returns the current timestamp in milliseconds.
     */
    private getTime;
    /**
     * Adds a new function to the queue. Returns a `Promise` which resolves when the function finishes running, or
     * rejects if the function encounters an error.
     *
     * @param fn The function that will be executed in the queue.
     */
    push<T>(fn: (resolve: Resolve<T>, reject: Reject, retry: Retry) => any): Promise<T>;
    /**
     * Executes the given item, or the next item in line.
     *
     * @param item
     */
    private execute;
}
declare type Resolve<T = any> = (arg: T) => void;
declare type Reject = (error: Error) => void;
declare type Retry = (retryAfter?: number) => void;
export {};
