import { Client } from '../client';
import { Sale, GetPurchasesOptions, GetStatementOptions, GetDownloadLinkOptions } from '../types/private';
import { MarketDomain } from '../types/market';
export declare class PrivateClientGroup {
    private client;
    constructor(client: Client);
    /**
     * Lists all unrefunded sales of the authenticated user's items listed on Envato Market. Author sales data
     * ("Amount") is reported before subtraction of any income taxes (eg US Royalty Withholding Tax).
     *
     * @param page A page number to start the results from.
     */
    getSales(page?: number): Promise<GetSalesResponse>;
    /**
     * Returns the details of an author's sale identified by the purchase code. Author sales data ("Amount") is reported
     * before subtraction of any income taxes (eg US Royalty Withholding Tax). Returns `undefined` if no matching sale
     * is found.
     *
     * @param code The unique code of the sale to return.
     */
    getSale(code: string): Promise<GetSaleResponse | undefined>;
    /**
     * List purchases.
     *
     * @param code The unique code of the sale to return.
     */
    getPurchases(options: GetPurchasesOptions): Promise<GetPurchasesResponse>;
    /**
     * Lists all purchases that the authenticated user has made of the app creator's listed items. Only works
     * with OAuth tokens.
     *
     * @param page A page number to start the results from.
     */
    getPurchasesFromAppCreator(page?: number): Promise<GetPurchasesFromAppCreatorResponse>;
    /**
     * Returns the details of a user's purchase identified by the purchase code. Returns `undefined` if no matching
     * purchase is found.
     *
     * @param code The unique code of the purchase to return.
     * @deprecated The `purchase:history` permission is deprecated, please use `purchase:verify` instead.
     */
    getPurchase(code: string): Promise<GetPurchaseResponse | undefined>;
    /**
     * Returns the first name, surname, earnings available to withdraw, total deposits, balance (deposits + earnings)
     * and country.
     */
    getAccountDetails(): Promise<GetPrivateAccountDetailsResponse>;
    /**
     * Returns the currently logged in user's Envato Account username.
     */
    getUsername(): Promise<string>;
    /**
     * Returns the currently logged in user's email address.
     */
    getEmail(): Promise<string>;
    /**
     * Returns the monthly sales data, as displayed on the user's earnings page. Monthly sales data ("Earnings") is
     * reported before subtraction of any income taxes (eg US Royalty Withholding Tax).
     */
    getMonthlySales(): Promise<GetMonthlySalesResponse>;
    /**
     * Lists transactions from the user's statement page.
     */
    getStatement(options: GetStatementOptions): Promise<GetStatementResponse>;
    /**
     * Download purchased items by either the item_id or the purchase_code. Each invocation of this endpoint will count
     * against the items daily download limit.
     */
    getDownloadLink(options: GetDownloadLinkOptions): Promise<string>;
}
export declare type GetSalesResponse = Sale[];
export declare type GetSaleResponse = Sale & {
    /**
     * The username of the buyer. Note that this can be `null` if the item was purchased via guest checkout.
     */
    buyer?: string;
    /**
     * The number of times this buyer has purchased the item.
     */
    purchase_count: number;
};
export declare type GetPurchasesResponse = {
    count: number;
    results: (Sale & {
        code: string;
    })[];
};
export declare type GetPurchasesFromAppCreatorResponse = {
    buyer: {
        id: number;
        username: string;
    };
    author: {
        id: number;
        username: string;
    };
    purchases: (Sale & {
        code: string;
    })[];
};
export declare type GetPurchaseResponse = Sale & {
    code: string;
};
export declare type GetPrivateAccountDetailsResponse = {
    image: string;
    firstname: string;
    surname: string;
    available_earnings: string;
    total_deposits: string;
    balance: string;
    country: string;
};
export declare type GetUsernameResponse = {
    username: string;
};
export declare type GetEmailResponse = {
    email: string;
};
export declare type GetMonthlySalesResponse = {
    /**
     * The month as a timestamp (format: `"Mon Apr 01 00:00:00 +1100 2013"`).
     */
    month: Date;
    /**
     * The number of sales for this month as an unformatted integer in a string.
     */
    sales: string;
    /**
     * The total earnings from sales this month as a double in a string (e.g. `"652.45"`).
     */
    earnings: string;
}[];
export declare type GetStatementResponse = {
    count: number;
    results: {
        unique_id: string;
        date: Date;
        order_id?: number;
        type: string;
        detail: string;
        item_id?: number;
        document?: string;
        price?: number;
        au_gst?: number;
        eu_vat?: number;
        us_rwt?: number;
        us_bwt?: number;
        amount: number;
        site?: MarketDomain;
        other_party_country?: string;
        other_party_region?: string;
        other_party_city?: string;
        other_party_zipcode?: string;
    }[];
};
export declare type GetDownloadLinkResponse = {
    download_url: string;
};