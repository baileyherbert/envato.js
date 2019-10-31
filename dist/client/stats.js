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
class StatsClientGroup {
    constructor(client) {
        this.client = client;
    }
    /**
     * Shows the total number of subscribed users to Envato Market.
     */
    getTotalUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return parseInt(mutate.scope('total_users', mutate.scope('total-users', yield this.client.get(url.build('/v1/market/total-users.json')))));
        });
    }
    /**
     * Shows the total number of items available on Envato Market.
     */
    getTotalItems() {
        return __awaiter(this, void 0, void 0, function* () {
            return parseInt(mutate.scope('total_items', mutate.scope('total-items', yield this.client.get(url.build('/v1/market/total-items.json')))));
        });
    }
    /**
     * Shows the total number of items available on Envato Market.
     *
     * @param site Site.
     */
    getFilesPerCategory(site) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('number-of-files', yield this.client.get(url.prepare('/v1/market/number-of-files:%s.json', site)));
        });
    }
}
exports.StatsClientGroup = StatsClientGroup;
