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
class PrivateClientGroup {
    constructor(client) {
        this.client = client;
    }
    /**
     * Lists all unrefunded sales of the authenticated user's items listed on Envato Market. Author sales data
     * ("Amount") is reported before subtraction of any income taxes (eg US Royalty Withholding Tax).
     *
     * @param page A page number to start the results from.
     */
    getSales(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v3/market/author/sales', {
                page
            }));
        });
    }
    /**
     * Returns the details of an author's sale identified by the purchase code. Author sales data ("Amount") is reported
     * before subtraction of any income taxes (eg US Royalty Withholding Tax).
     *
     * @param code The unique code of the sale to return.
     */
    getSale(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v3/market/author/sale', {
                code
            }));
        });
    }
    /**
     * List purchases.
     *
     * @param code The unique code of the sale to return.
     */
    getPurchases(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v3/market/buyer/list-purchases', options));
        });
    }
    /**
     * Lists all purchases that the authenticated user has made of the app creator's listed items. Only works
     * with OAuth tokens.
     *
     * @param page A page number to start the results from.
     */
    getPurchasesFromAppCreator(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v3/market/buyer/purchases', {
                page
            }));
        });
    }
    /**
     * Returns the details of a user's purchase identified by the purchase code.
     *
     * @param code The unique code of the purchase to return.
     * @deprecated The `purchase:history` permission is deprecated, please use `purchase:verify` instead.
     */
    getPurchase(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v3/market/buyer/purchase', {
                code
            }));
        });
    }
    /**
     * Returns the first name, surname, earnings available to withdraw, total deposits, balance (deposits + earnings)
     * and country.
     */
    getAccountDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('account', yield this.client.get(url.build('/v1/market/private/user/account.json')));
        });
    }
    /**
     * Returns the currently logged in user's Envato Account username.
     */
    getUsername() {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('username', yield this.client.get(url.build('/v1/market/private/user/username.json')));
        });
    }
    /**
     * Returns the currently logged in user's email address.
     */
    getEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('email', yield this.client.get(url.build('/v1/market/private/user/email.json')));
        });
    }
    /**
     * Returns the monthly sales data, as displayed on the user's earnings page. Monthly sales data ("Earnings") is
     * reported before subtraction of any income taxes (eg US Royalty Withholding Tax).
     */
    getMonthlySales() {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('earnings-and-sales-by-month', yield this.client.get(url.build('/v1/market/private/user/earnings-and-sales-by-month.json')));
        });
    }
    /**
     * Lists transactions from the user's statement page.
     */
    getStatement(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.get(url.build('/v3/market/user/statement', options));
        });
    }
    /**
     * Download purchased items by either the item_id or the purchase_code. Each invocation of this endpoint will count
     * against the items daily download limit.
     */
    getDownloadLink(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return mutate.scope('download_url', yield this.client.get(url.build('/v3/market/buyer/download', options)));
        });
    }
}
exports.PrivateClientGroup = PrivateClientGroup;
