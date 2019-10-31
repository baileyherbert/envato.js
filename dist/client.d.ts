/// <reference types="node" />
import * as request from 'request';
import { CatalogClientGroup } from './client/catalog';
import { PrivateClientGroup } from './client/private';
import { StatsClientGroup } from './client/stats';
import { UserClientGroup } from './client/user';
import { OAuth, RefreshedToken } from './oauth';
import { EventEmitter } from 'events';
export declare class Client extends EventEmitter {
    private options;
    private _catalog;
    private _private;
    private _stats;
    private _user;
    constructor(options: ClientOptions);
    /**
     * The current access token for the client, which may either be an OAuth access token or a personal token.
     */
    readonly token: string;
    /**
     * The refresh token if one was provided when the client was instantiated. The refresh token is only applicable to
     * OAuth sessions and is used by the client to predict the expiration of access tokens for faster regeneration.
     *
     * If a refresh token is not known or available, this will be `undefined`.
     */
    readonly refreshToken: string;
    /**
     * The timestamp (in milliseconds) when the current token expires. This will be `undefined` if the client was not
     * instantiated with an expiration time.
     */
    readonly expiration: number | Date;
    /**
     * This will be  `true` if this token has expired. This will always return `false` if the client was not
     * instantiated with an expiration time.
     */
    readonly expired: boolean;
    /**
     * The number of milliseconds remaining until the current token expires. This can become negative if the expiration
     * time is in the past. If an expiration time is not set on the client, this will be `undefined`.
     */
    readonly ttl: number;
    /**
     * Returns the identity of the current token, which includes the account id, a list of all granted permissions, and
     * the number of seconds until the token expires.
     */
    getIdentity(): Promise<IdentityResponse>;
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
    /**
     * Fetches the path via the given method.
     */
    protected fetch<T>(method: string, path: string, form?: {
        [name: string]: any;
    }): Promise<T>;
    /**
     * Returns an absolute URL to the API with the given path.
     */
    private uri;
    /**
     * Handles a response from the API, properly throwing errors or parsing the response as appropriate.
     */
    private handleResponse;
    /**
     * Returns an `ErrorResponse` instance from the given response body.
     */
    private getErrorResponse;
    on(event: 'debug', listener: (err: Error | undefined, response: request.Response, body: string) => void): this;
    on(event: 'renew', listener: (data: RefreshedToken) => void): this;
}
export declare type ClientOptions = {
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
     * The OAuth helper instance to use for automatically refreshing access tokens.
     */
    oauth?: OAuth;
    /**
     * Optional configuration for the underlying `request` library.
     */
    request?: request.CoreOptions;
};
export declare type IdentityResponse = {
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
