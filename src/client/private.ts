import { Client } from '../client';
import { Sale, GetPurchasesOptions, GetStatementOptions, GetDownloadLinkOptions } from '../types/private';
import { MarketDomain } from '../types/market';

import * as url from '../util/url';
import * as mutate from '../util/mutate';
import * as errors from '../util/errors';

export class PrivateClientGroup {

    public constructor(private client: Client) {}

    /**
     * Lists all unrefunded sales of the authenticated user's items listed on Envato Market. Author sales data
     * ("Amount") is reported before subtraction of any income taxes (eg US Royalty Withholding Tax).
     *
     * @param page A page number to start the results from.
     */
    public getSales(page?: number) {
        return this.client.get<GetSalesResponse>(url.build('/v3/market/author/sales', {
            page
        }));
    }

    /**
     * Returns the details of an author's sale identified by the purchase code. Author sales data ("Amount") is reported
     * before subtraction of any income taxes (eg US Royalty Withholding Tax). Returns `undefined` if no matching sale
     * is found.
     *
     * @param code The unique code of the sale to return.
     */
    public getSale(code: string) {
        return errors.find(this.client.get<GetSaleResponse>(url.build('/v3/market/author/sale', {
            code
        })));
    }

    /**
     * List purchases.
     *
     * @param code The unique code of the sale to return.
     */
    public getPurchases(options: GetPurchasesOptions) {
        return this.client.get<GetPurchasesResponse>(url.build('/v3/market/buyer/list-purchases', options));
    }

    /**
     * Lists all purchases that the authenticated user has made of the app creator's listed items. Only works
     * with OAuth tokens.
     *
     * @param page A page number to start the results from.
     */
    public getPurchasesFromAppCreator(page ?: number) {
        return this.client.get<GetPurchasesFromAppCreatorResponse>(url.build('/v3/market/buyer/purchases', {
            page
        }));
    }

    /**
     * Returns the details of a user's purchase identified by the purchase code. Returns `undefined` if no matching
     * purchase is found.
     *
     * @param code The unique code of the purchase to return.
     * @deprecated The `purchase:history` permission is deprecated, please use `purchase:verify` instead.
     */
    public getPurchase(code: string) {
        return errors.find(this.client.get<GetPurchaseResponse>(url.build('/v3/market/buyer/purchase', {
            code
        })));
    }

    /**
     * Returns the first name, surname, earnings available to withdraw, total deposits, balance (deposits + earnings)
     * and country.
     */
    public async getAccountDetails() : Promise<GetPrivateAccountDetailsResponse> {
        return mutate.scope(
            'account',
            await this.client.get<any>(url.build('/v1/market/private/user/account.json'))
        );
    }

    /**
     * Returns the currently logged in user's Envato Account username.
     */
    public async getUsername(){
        return mutate.scope(
            'username',
            await this.client.get<GetUsernameResponse>(url.build('/v1/market/private/user/username.json'))
        );
    }

    /**
     * Returns the currently logged in user's email address.
     */
    public async getEmail() {
        return mutate.scope(
            'email',
            await this.client.get<GetEmailResponse>(url.build('/v1/market/private/user/email.json'))
        );
    }

    /**
     * Returns the monthly sales data, as displayed on the user's earnings page. Monthly sales data ("Earnings") is
     * reported before subtraction of any income taxes (eg US Royalty Withholding Tax).
     */
    public async getMonthlySales() : Promise<GetMonthlySalesResponse> {
        return mutate.scope(
            'earnings-and-sales-by-month',
            await this.client.get<any>(url.build('/v1/market/private/user/earnings-and-sales-by-month.json'))
        );
    }

    /**
     * Lists transactions from the user's statement page.
     */
    public getStatement(options: GetStatementOptions) {
        return this.client.get<GetStatementResponse>(url.build('/v3/market/user/statement', options));
    }

    /**
     * Download purchased items by either the item_id or the purchase_code. Each invocation of this endpoint will count
     * against the items daily download limit.
     */
    public async getDownloadLink(options: GetDownloadLinkOptions) {
        return mutate.scope(
            'download_url',
            await this.client.get<GetDownloadLinkResponse>(url.build('/v3/market/buyer/download', options))
        );
    }

}

export type GetSalesResponse = Sale[];

export type GetSaleResponse = Sale & {
    /**
     * The username of the buyer. Note that this can be `null` if the item was purchased via guest checkout.
     */
    buyer ?: string;

    /**
     * The number of times this buyer has purchased the item.
     */
    purchase_count: number;
};

export type GetPurchasesResponse = {
    count: number;
    results: (Sale & { code: string })[];
};

export type GetPurchasesFromAppCreatorResponse = {
    buyer: {
        id: number;
        username: string;
    };
    author: {
        id: number;
        username: string;
    }
    purchases: (Sale & { code: string })[];
};

export type GetPurchaseResponse = Sale & { code: string };

export type GetPrivateAccountDetailsResponse = {
    image: string;
    firstname: string;
    surname: string;
    available_earnings: string;
    total_deposits: string;
    balance: string;
    country: string;
};

export type GetUsernameResponse = {
    username: string;
};

export type GetEmailResponse = {
    email: string;
};

export type GetMonthlySalesResponse = {
    /**
     * The month as a timestamp (format: `"Mon Apr 01 00:00:00 +1100 2013"`).
     */
    month: string;

    /**
     * The number of sales for this month as an unformatted integer in a string.
     */
    sales: string;

    /**
     * The total earnings from sales this month as a double in a string (e.g. `"652.45"`).
     */
    earnings: string;
}[];

export type GetStatementResponse = {
    count: number;
    results: {
        unique_id: string;
        date: string;
        order_id ?: number;
        type: string;
        detail: string;
        item_id ?: number;
        document ?: string;
        price ?: number;
        au_gst ?: number;
        eu_vat ?: number;
        us_rwt ?: number;
        us_bwt ?: number;
        amount: number;
        site ?: MarketDomain;
        other_party_country ?: string;
        other_party_region ?: string;
        other_party_city ?: string;
        other_party_zipcode ?: string;
    }[];
};

export type GetDownloadLinkResponse = {
    download_url: string;
}
