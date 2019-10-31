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
const url = require("./util/url");
const client_1 = require("./client");
class OAuth {
    constructor(options) {
        this.options = options;
    }
    getRedirectUrl() {
        return url.build('https://api.envato.com/authorization', {
            response_type: 'code',
            client_id: this.options.client_id,
            redirect_uri: this.options.redirect_uri
        });
    }
    /**
     * Authorizes the user based on the given authentication code and returns a `Client` with their access token,
     * refresh token, and expiration time configured and ready-to-go.
     *
     * @param code The single-use authentication code returned from the Envato authorization screen.
     */
    getClient(code) {
        return new Promise((resolve, reject) => {
            request.post('https://api.envato.com/token', Object.assign({}, this.options.request || {}, {
                form: {
                    grant_type: 'authorization_code',
                    client_id: this.options.client_id,
                    client_secret: this.options.client_secret,
                    code
                },
                headers: {
                    'User-Agent': 'Envato.js (https://github.com/baileyherbert/envato.js)'
                }
            }), (err, response, body) => {
                if (err)
                    return reject(err);
                if (response.statusCode !== 200) {
                    if (body.startsWith('{')) {
                        let error = JSON.parse(body);
                        if (error.error) {
                            switch (error.error) {
                                case 'invalid_grant': return reject(new Error('The given code was invalid or expired'));
                            }
                        }
                        if (error.error_description) {
                            return reject(new Error(error.error_description));
                        }
                    }
                    return reject(new Error(`Got unexpected status code (${response.statusCode})`));
                }
                let data = JSON.parse(body);
                if (!data.token_type)
                    return reject(new Error('Unexpected response from API: \n' + body));
                resolve(new client_1.Client({
                    token: data.access_token,
                    refreshToken: data.refresh_token,
                    userAgent: this.options.userAgent,
                    expiration: (new Date()).getTime() + (data.expires_in * 1000) - 1000,
                    oauth: this
                }));
            });
        });
    }
    /**
     * Returns a new access token for the given client.
     *
     * @param client The client whose access token needs to be renewed.
     */
    renew(client) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                request.post('https://api.envato.com/token', Object.assign({}, this.options.request || {}, {
                    form: {
                        grant_type: 'refresh_token',
                        client_id: this.options.client_id,
                        client_secret: this.options.client_secret,
                        refresh_token: client.refreshToken
                    },
                    headers: {
                        'User-Agent': 'Envato.js (https://github.com/baileyherbert/envato.js)'
                    }
                }), (err, response, body) => {
                    if (err)
                        return reject(err);
                    if (response.statusCode !== 200) {
                        return reject(new Error(`Got unexpected status code (${response.statusCode}) when renewing token`));
                    }
                    let data = JSON.parse(body);
                    if (!data.token_type)
                        return reject(new Error('Unexpected response from API when renewing token: \n' + body));
                    resolve({
                        access_token: data.access_token,
                        expiration: (new Date()).getTime() + (data.expires_in * 1000) - 1000
                    });
                });
            });
        });
    }
}
exports.OAuth = OAuth;
