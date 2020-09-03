import { CatalogEndpoints } from './endpoints/catalog';
import { PrivateEndpoints } from './endpoints/private';
import { StatsEndpoints } from './endpoints/stats';
import { UserEndpoints } from './endpoints/user';
import { OAuth, IRefreshedToken } from './oauth';
import { EventEmitter } from 'events';
import { Queue } from './util/queue';
import { HttpClient, EnvatoHttpOptions, RequestMethod, RequestOptions, RequestForm, RequestHeaders, EnvatoHttpResponse } from './helpers/http';
import { scope } from './util/mutate';
import { Response as FetchResponse } from 'node-fetch';

export class Client extends EventEmitter {

    /**
     * A collection of endpoints for browsing the Envato Market catalog.
     */
    public readonly catalog: CatalogEndpoints;

    /**
     * A collection of endpoints for accessing private details about the current user.
     */
    public readonly private: PrivateEndpoints;

    /**
     * A collection of endpoints for accessing public details about users.
     */
    public readonly user: UserEndpoints;

    /**
     * A collection of endpoints for retrieving general statistics about the marketplaces.
     */
    public readonly stats: StatsEndpoints;

    /**
     * The client options.
     */
    public options: ClientOptions;

    /**
     * The queue for executing requests.
     */
    private _queue: Queue;

    /**
     * The HTTP client for sending requests.
     */
    private _httpClient: HttpClient;

    /**
     * Constructs a new `Client` instance.
     */
    public constructor(token: string);
    public constructor(options: ClientOptions);
    public constructor(tokenOrOptions: ClientOptions | string) {
        super();

        // Convert the options to an object
        if (typeof tokenOrOptions === 'string') {
            tokenOrOptions = { token: tokenOrOptions };
        }

        // Set defaults
        if (typeof tokenOrOptions.handleRateLimits === 'undefined') tokenOrOptions.handleRateLimits = true;

        // Set properties
        this.options = tokenOrOptions;
        this.catalog = new CatalogEndpoints(this);
        this.private = new PrivateEndpoints(this);
        this.stats = new StatsEndpoints(this);
        this.user = new UserEndpoints(this);
        this._queue = new Queue(this);
        this._httpClient = new HttpClient(this);

        // Forward queue events
        this._queue.on('ratelimit', duration => this.emit('ratelimit', duration));
        this._queue.on('resume', () => this.emit('resume'));
    }

    /**
     * The current access token for the client, which may either be an OAuth access token or a personal token.
     */
    public get token() { return this.options.token; }
    public set token(token: string) { this.options.token = token; }

    /**
     * The refresh token if one was provided when the client was instantiated. The refresh token is only applicable to
     * OAuth sessions and is used by the client to predict the expiration of access tokens for faster regeneration.
     *
     * If a refresh token is not known or available, this will be `undefined`.
     */
    public get refreshToken() { return this.options.refreshToken; }
    public set refreshToken(token : string | undefined) { this.options.refreshToken = token; }

    /**
     * The timestamp (in milliseconds) when the current token expires. This will be `undefined` if the client was not
     * instantiated with an expiration time.
     */
    public get expiration() { return this.options.expiration; }
    public set expiration(expiration: number | Date | undefined) { this.options.expiration = expiration; }

    /**
     * This will be  `true` if this token has expired. This will always return `false` if the client was not
     * instantiated with an expiration time.
     */
    public get expired() {
        if (this.options.expiration) {
            return this.options.expiration < (new Date()).getTime();
        }

        return false;
    }

    /**
     * The number of milliseconds remaining until the current token expires. This can become negative if the expiration
     * time is in the past. If an expiration time is not set on the client, this will be `undefined`.
     */
    public get ttl() {
        if (!this.options.expiration) return;

        // Convert dates into second timestamps
        if (this.options.expiration instanceof Date) {
            this.options.expiration = this.options.expiration.getTime();
        }

        return this.options.expiration - (new Date()).getTime();
    }

    /**
     * Whether or not the client is currently rate limited and deferring requests. You can also use the `ratelimit`
     * and `resume` client events to track changes to this value.
     */
    public get rateLimited() {
        return this._queue.isDeferring();
    }

    /**
     * Returns the identity of the current token, which includes the account id, a list of all granted permissions, and
     * the number of seconds until the token expires.
     */
    public getIdentity() {
        return this.get<IdentityResponse>('/whoami');
    }

    /**
     * Returns the unique Envato Account ID for the current user.
     */
    public async getId() {
        return scope('userId', await this.getIdentity());
    }

    /**
     * Sends a `GET` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param options Fetch options to use for this request.
     */
    public get<T = any>(path: string, options?: RequestOptions) : Promise<T> {
        return this._fetch('GET', path, undefined, options);
    }

    /**
     * Sends a `POST` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     * @param options Fetch options to use for this request.
     */
    public post<T = any>(path: string, params?: RequestForm, options?: RequestOptions) : Promise<T> {
        return this._fetch('POST', path, params, options);
    }

    /**
     * Sends a `PUT` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     * @param options Fetch options to use for this request.
     */
    public put<T = any>(path: string, params?: RequestForm, options?: RequestOptions) : Promise<T> {
        return this._fetch('PUT', path, params, options);
    }

    /**
     * Sends a `PATCH` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     * @param options Fetch options to use for this request.
     */
    public patch<T = any>(path: string, params?: RequestForm, options?: RequestOptions) : Promise<T> {
        return this._fetch('PATCH', path, params, options);
    }

    /**
     * Sends a `DELETE` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     * @param options Fetch options to use for this request.
     */
    public delete<T = any>(path: string, params?: RequestForm, options?: RequestOptions) : Promise<T> {
        return this._fetch('DELETE', path, params, options);
    }

    /**
     * Performs an HTTP request to the API.
     *
     * @param method
     * @param path
     * @param form
     * @param options
     */
    private _fetch<T>(method: RequestMethod, path: string, form?: RequestForm, options?: RequestOptions) : Promise<T> {
        return this._queue.push<T>(async (resolve, reject, retry) => {
            if (this.expired && this.options.oauth && this.options.refreshToken) {
                const refresh = await this.options.oauth.renew(this);

                this.options.token = refresh.token;
                this.options.expiration = refresh.expiration;

                this.emit('renew', refresh);
            }

            try {
                const url = this._getFullRequestUrl(path);
                const headers = this._getRequestHeaders();
                const http = this.options.http;
                const res = await this._httpClient.fetch<T>({ headers, url, form, method, options });

                this.emit('debug', res);

                if ((this.options.concurrency || 1) > 0 && this.options.handleRateLimits && res.status === 429) {
                    const retryAfterString = res.headers['retry-after'] || '0';
                    const retryAfter = parseInt(retryAfterString) || 0;

                    // Reschedule the fetch in the queue
                    return retry(retryAfter);
                }

                // If the status code isn't 200, then statusError will have an HttpError instance that we can throw
                if (res.error) {
                    return reject(res.error);
                }

                // At this point, we should have everything squared away
                resolve(res.body);
            }
            catch (error) {
                reject(error);
            }
        });
    }

    private _getRequestHeaders(): RequestHeaders {
        const headers = {
            authorization: 'Bearer ' + this.options.token
        };

        if (this.options.userAgent) {
            headers['user-agent'] = this.options.userAgent;
        }

        return headers;
    }

    private _getFullRequestUrl(path: string) {
        return 'https://api.envato.com/' + path.replace(/^\/+/, '');
    }

    public on(event: 'debug', listener: (response: EnvatoHttpResponse<any>) => void): this;
    public on(event: 'renew', listener: (data: IRefreshedToken) => void): this;
    public on(event: 'ratelimit', listener: (duration: number) => void): this;
    public on(event: 'resume', listener: () => void): this;
    public on(event: string, listener: (...args: any[]) => void) {
        return super.on(event, listener);
    }
}

export interface ClientOptions {
    /**
     * The token to use for authorization. Acceptable values include:
     *
     * - Personal tokens.
     * - Access tokens (OAuth).
     */
    token: string;

    /**
     * The user agent string to send with requests. This should briefly explain what your app is or its purpose.
     * Please do not use a generic browser user agent.
     *
     * Here are some examples of good user agents:
     *
     * - `"License activation for my themes"`
     * - `"Support forum authentication & license verification"`
     * - `"Gathering data on items"`
     */
    userAgent?: string;

    /**
     * For OAuth sessions, you may optionally provide the refresh token to enable automatic token renewal when the
     * current access token expires. You must also supply the `expiration` option when providing this option.
     */
    refreshToken?: string;

    /**
     * For OAuth sessions, you should provide a timestamp representing the time when the access token expires as a
     * number (in milliseconds) or a `Date`. The client will automatically generate a new access token using the
     * `refreshToken` option after the expiration time is reached, as long as the `oauth` option is provided.
     *
     * **Note:** If you need to store newly generated access tokens, listen for the `renew` event on the client.
     */
    expiration?: Date | number;

    /**
     * The OAuth helper instance to use for automatically refreshing access tokens. This instance must have the same
     * credentials as the instance that was used to authenticate the OAuth session.
     */
    oauth?: OAuth;

    /**
     * Optional configuration for outgoing HTTP requests.
     */
    http?: EnvatoHttpOptions;

    /**
     * If set to `true`, the client will automatically handle rate limits. Any blocked requests will be retried when
     * the rate limit ends. Any additional requests sent during a rate limit event will be deferred. Rate limit events
     * will trigger a `throttled` event on the client when this feature is enabled.
     *
     * If set to `false`, rate limited requests will throw an `Envato.TooManyRequests` error and subsequent requests
     * will not be throttled.
     *
     * Defaults to `true`.
     */
    handleRateLimits?: boolean;

    /**
     * The maximum number of simultaneous requests this client can send to Envato. It is highly recommended to set a
     * fairly low limit to avoid getting rate limited.
     *
     * If set to `0`, requests will not be throttled and will always be executed immediately.
     *
     * Defaults to `3`.
     */
    concurrency?: number;
};

export interface IdentityResponse {
    /**
     * The client ID of the application, if this is an OAuth session. Otherwise, this is `null`.
     */
    clientId?: string;

    /**
     * The unique ID of the user who is authorized by the current token.
     */
    userId: number;

    /**
     * A list of permissions (scopes) the current token has been granted.
     */
    scopes: string[];

    /**
     * The number of seconds remaining until the current token expires. This will always be `315360000` for personal
     * tokens as they are indefinitely valid.
     */
    ttl: number;
};

