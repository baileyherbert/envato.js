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
const url = require("../util/url");
const mutate = require("../util/mutate");
class UserClientGroup {
    constructor(client) {
        this.client = client;
    }
    /**
     * Lists all of the user's private and public collections.
     */
    getCollections() {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('collections', yield this.client.get(url.build('/v3/market/user/collections')));
        });
    }
    /**
     * Returns details and items for public or the user's private collections.
     *
     * @param id The numeric ID of the collection to return.
     */
    getPrivateCollection(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v3/market/user/collection', {
                id
            }));
        });
    }
    /**
     * Shows username, country, number of sales, number of followers, location and image for a user.
     *
     * @param username Username.
     */
    getAccountDetails(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('user', yield this.client.get(url.prepare('/v1/market/user:%s.json', username)));
        });
    }
    /**
     * Shows a list of badges for the given user.
     *
     * @param username Username.
     */
    getBadges(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('user-badges', yield this.client.get(url.prepare('/v1/market/user-badges:%s.json', username)));
        });
    }
    /**
     * Show the number of items an author has for sale on each site.
     *
     * @param username Username.
     */
    getItemsBySite(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('user-items-by-site', yield this.client.get(url.prepare('/v1/market/user-items-by-site:%s.json', username)));
        });
    }
    /**
     * Shows up to 1000 newest files uploaded by a user to a particular site.
     *
     * @param username Username.
     * @param site Site.
     */
    getNewItems(username, site) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('new-files-from-user', yield this.client.get(url.prepare('/v1/market/new-files-from-user:%s,%s.json', username, site)));
        });
    }
}
exports.UserClientGroup = UserClientGroup;
