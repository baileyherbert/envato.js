"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const catalog_1 = require("./client/catalog");
const private_1 = require("./client/private");
const stats_1 = require("./client/stats");
const user_1 = require("./client/user");
const http_1 = require("./errors/http");
const events_1 = require("events");
class Client extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this._catalog = new catalog_1.CatalogClientGroup(this);
        this._private = new private_1.PrivateClientGroup(this);
        this._stats = new stats_1.StatsClientGroup(this);
        this._user = new user_1.UserClientGroup(this);
    }
    /**
     * The current access token for the client, which may either be an OAuth access token or a personal token.
     */
    get token() {
        return this.options.token;
    }
    /**
     * The refresh token if one was provided when the client was instantiated. The refresh token is only applicable to
     * OAuth sessions and is used by the client to predict the expiration of access tokens for faster regeneration.
     *
     * If a refresh token is not known or available, this will be `undefined`.
     */
    get refreshToken() {
        return this.options.refreshToken;
    }
    /**
     * The timestamp (in milliseconds) when the current token expires. This will be `undefined` if the client was not
     * instantiated with an expiration time.
     */
    get expiration() {
        return this.options.expiration;
    }
    /**
     * This will be  `true` if this token has expired. This will always return `false` if the client was not
     * instantiated with an expiration time.
     */
    get expired() {
        if (this.options.expiration) {
            return this.options.expiration < (new Date()).getTime();
        }
        return false;
    }
    /**
     * The number of milliseconds remaining until the current token expires. This can become negative if the expiration
     * time is in the past. If an expiration time is not set on the client, this will be `undefined`.
     */
    get ttl() {
        if (!this.options.expiration)
            return;
        // Convert dates into second timestamps
        if (this.options.expiration instanceof Date) {
            this.options.expiration = this.options.expiration.getTime();
        }
        return this.options.expiration - (new Date()).getTime();
    }
    /**
     * Returns the identity of the current token, which includes the account id, a list of all granted permissions, and
     * the number of seconds until the token expires.
     */
    getIdentity() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('/whoami');
        });
    }
    /**
     * A collection of endpoints for browsing the Envato Market catalog.
     */
    get catalog() {
        return this._catalog;
    }
    /**
     * A collection of endpoints for accessing private details about the current user.
     */
    get private() {
        return this._private;
    }
    /**
     * A collection of endpoints for accessing public details about users.
     */
    get user() {
        return this._user;
    }
    /**
     * A collection of endpoints for retrieving general statistics about the marketplaces.
     */
    get stats() {
        return this._stats;
    }
    /**
     * Sends a `GET` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     */
    get(path) {
        return this.fetch('GET', path);
    }
    /**
     * Sends a `POST` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     */
    post(path, params) {
        return this.fetch('POST', path, params);
    }
    /**
     * Sends a `PUT` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     */
    put(path, params) {
        return this.fetch('PUT', path, params);
    }
    /**
     * Sends a `PATCH` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     */
    patch(path, params) {
        return this.fetch('PATCH', path, params);
    }
    /**
     * Sends a `DELETE` request to the given path on the API and returns the parsed response.
     *
     * @param path The path to query (such as `"/catalog/item"`).
     * @param params The posted parameters to send with the request.
     */
    delete(path, params) {
        return this.fetch('DELETE', path, params);
    }
    /**
     * Fetches the path via the given method.
     */
    fetch(method, path, form) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.expired && this.options.oauth && this.options.refreshToken) {
                let refresh = yield this.options.oauth.renew(this);
                this.options.token = refresh.access_token;
                this.options.expiration = refresh.expiration;
                this.emit('renew', refresh);
            }
            request(Object.assign({}, this.options.request || {}, {
                url: this.uri(path),
                headers: {
                    'Authorization': 'Bearer ' + this.options.token,
                    'User-Agent': this.options.userAgent || 'Envato.js (https://github.com/baileyherbert/envato.js)'
                },
                method,
                form
            }), (err, response, body) => this.handleResponse(err, response, body, resolve, reject));
        }));
    }
    /**
     * Returns an absolute URL to the API with the given path.
     */
    uri(path) {
        return 'https://api.envato.com/' + path.replace(/^\/+/, '');
    }
    /**
     * Handles a response from the API, properly throwing errors or parsing the response as appropriate.
     */
    handleResponse(err, response, body, resolve, reject) {
        this.emit('debug', err, response, body);
        if (err)
            return reject(err);
        if (response.statusCode !== 200) {
            switch (response.statusCode) {
                case 400: return reject(new http_1.BadRequestError(this.getErrorResponse(body)));
                case 401: return reject(new http_1.UnauthorizedError(this.getErrorResponse(body)));
                case 403: return reject(new http_1.AccessDeniedError(this.getErrorResponse(body)));
                case 404: return reject(new http_1.NotFoundError(this.getErrorResponse(body)));
                case 429: return reject(new http_1.TooManyRequestsError(this.getErrorResponse(body)));
                case 500: return reject(new http_1.ServerError(this.getErrorResponse(body)));
                default: reject(new http_1.HttpError('Unknown error', response.statusCode, this.getErrorResponse(body)));
            }
        }
        try {
            return resolve(JSON.parse(body));
        }
        catch (error) {
            throw new Error(`Failed to parse response: ${error.message}`);
        }
    }
    /**
     * Returns an `ErrorResponse` instance from the given response body.
     */
    getErrorResponse(body) {
        if (typeof body == 'string') {
            try {
                return JSON.parse(body);
            }
            catch (error) {
                return {
                    error: body
                };
            }
        }
        return {
            error: 'Unknown error'
        };
    }
    on(event, listener) {
        return super.on(event, listener);
    }
}
exports.Client = Client;
