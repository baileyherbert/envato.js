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
class CatalogClientGroup {
    constructor(client) {
        this.client = client;
    }
    /**
     * Returns details of, and items contained within, a public collection.
     *
     * @param id The numeric ID of the collection to return.
     * @param page Page number.
     */
    getCollection(id, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v3/market/catalog/collection', {
                id, page
            }));
        });
    }
    /**
     * Returns all details of a particular item on Envato Market.
     *
     * @param id The numeric ID of the item to return.
     */
    getItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v3/market/catalog/item', {
                id
            }));
        });
    }
    /**
     * Returns the latest available version of a theme/plugin. This is the recommended endpoint for Wordpress
     * theme/plugin authors building an auto-upgrade system into their item that needs to check if a new version is
     * available.
     *
     * @param id The numeric ID of the item to return.
     */
    getItemVersion(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v3/market/catalog/item-version', {
                id
            }));
        });
    }
    /**
     * @param options The search options.
     */
    searchItems(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v1/discovery/search/search/item', options));
        });
    }
    /**
     * @param options The search options.
     */
    searchComments(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v1/discovery/search/search/comment', options));
        });
    }
    /**
     * Returns the popular files for a particular site.
     *
     * @param site Site.
     */
    getPopularItems(site) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('popular', yield this.client.get(url.prepare('/v1/market/popular:%s.json', site)));
        });
    }
    /**
     * Lists the categories of a particular site.
     *
     * @param site Site.
     */
    getCategories(site) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('categories', yield this.client.get(url.prepare('/v1/market/categories:%s.json', site)));
        });
    }
    /**
     * Return available licenses and prices for the given item ID.
     *
     * @param id Item ID.
     */
    getItemPrices(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('item-prices', yield this.client.get(url.prepare('/v1/market/item-prices:%d.json', id)));
        });
    }
    /**
     * New files, recently uploaded to a particular site.
     *
     * @param site Site.
     * @param category Category.
     */
    getNewFiles(site, category) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('new-files', yield this.client.get(url.prepare('/v1/market/new-files:%s,%s.json', site, category)));
        });
    }
    /**
     * Shows the current site features.
     *
     * @param site Site.
     */
    getFeatures(site) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('features', yield this.client.get(url.prepare('/v1/market/features:%s.json', site)));
        });
    }
    /**
     * Shows a random list of newly uploaded files from a particular site (i.e. like the homepage).
     *
     * **Note:** This doesn't actually appear to be random, but rather sorted by newest first. Could change in future
     * since the endpoint is officially intended to return random results.
     *
     * @param site Site.
     */
    getRandomNewFiles(site) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('random-new-files', yield this.client.get(url.prepare('/v1/market/random-new-files:%s.json', site)));
        });
    }
}
exports.CatalogClientGroup = CatalogClientGroup;
