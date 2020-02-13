/// <reference types="node" />
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { CatalogClientGroup } from './client/catalog';
import { PrivateClientGroup } from './client/private';
import { StatsClientGroup } from './client/stats';
import { UserClientGroup } from './client/user';
import { OAuth, RefreshedToken } from './oauth';
import { EventEmitter } from 'events';
export declare class Client extends EventEmitter {
    /**
     * A collection of endpoints for browsing the Envato Market catalog.
     */
    readonly catalog: CatalogClientGroup;
    /**
     * A collection of endpoints for accessing private details about the current user.
     */
    readonly private: PrivateClientGroup;
    /**
     * A collection of endpoints for accessing public details about users.
     */
    readonly user: UserClientGroup;
    /**
     * A collection of endpoints for retrieving general statistics about the marketplaces.
     */
    readonly stats: StatsClientGroup;
    /**
     * The client options.
     */
    options: ClientOptions;
    /**
     * The queue for executing requests.
     */
    private queue;
    /**
     * Constructs a new `Client` instance.
     */
    constructor(token: string);
    constructor(options: ClientOptions);
    /**
     * The current access token for the client, which may either be an OAuth access token or a personal token.
     */
    get token(): string;
    set token(token: string);
    /**
     * The refresh token if one was provided when the client was instantiated. The refresh token is only applicable to
     * OAuth sessions and is used by the client to predict the expiration of access tokens for faster regeneration.
     *
     * If a refresh token is not known or available, this will be `undefined`.
     */
    get refreshToken(): string | undefined;
    set refreshToken(token: string | undefined);
    /**
     * The timestamp (in milliseconds) when the current token expires. This will be `undefined` if the client was not
     * instantiated with an expiration time.
     */
    get expiration(): number | Date | undefined;
    set expiration(expiration: number | Date | undefined);
    /**
     * This will be  `true` if this token has expired. This will always return `false` if the client was not
     * instantiated with an expiration time.
     */
    get expired(): boolean;
    /**
     * The number of milliseconds remaining until the current token expires. This can become negative if the expiration
     * time is in the past. If an expiration time is not set on the client, this will be `undefined`.
     */
    get ttl(): number | undefined;
    /**
     * Returns the identity of the current token, which includes the account id, a list of all granted permissions, and
     * the number of seconds until the token expires.
     */
    getIdentity(): Promise<IdentityResponse>;
    /**
     * Sends a `GET` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     */
    get<T = Object>(path: string): Promise<T>;
    /**
     * Sends a `POST` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     */
    post<T = Object>(path: string, params?: {
        [name: string]: any;
    }): Promise<T>;
    /**
     * Sends a `PUT` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     */
    put<T = Object>(path: string, params?: {
        [name: string]: any;
    }): Promise<T>;
    /**
     * Sends a `PATCH` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     */
    patch<T = Object>(path: string, params?: {
        [name: string]: any;
    }): Promise<T>;
    /**
     * Sends a `DELETE` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     */
    delete<T = Object>(path: string, params?: {
        [name: string]: any;
    }): Promise<T>;
    private _getRequestHeaders;
    on(event: 'debug', listener: (response: AxiosResponse<string>) => void): this;
    on(event: 'renew', listener: (data: RefreshedToken) => void): this;
    on(event: 'ratelimit', listener: (duration: number) => void): this;
    on(event: 'resume', listener: () => void): this;
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
     * Optional configuration for the underlying `axios` library.
     */
    axios?: AxiosRequestConfig;
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
}
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
}
