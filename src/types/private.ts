import { Item } from './catalog';

export type Sale = {
    amount: string;
    sold_at: string;
    license: string;
    support_amount: string;
    supported_until: string;
    item: Item;
};

export type GetPurchasesOptions = {
    /**
     * Optionally filter for WordPress plugins and themes.
     */
    filter_by ?: 'wordpress-themes' | 'wordpress-plugins';

    /**
     * Optional page number (default is 1).
     */
    page ?: number;

    /**
     * Include more item details.
     */
    include_all_item_details ?: boolean | 'true' | 'false';
};

export type GetStatementOptions = {
    /**
     * A page number to start the results from.
     */
    page ?: number;

    /**
     * The from date in `YYYY-MM-DD` format.
     */
    from_date ?: string;

    /**
     * The to date in `YYYY-MM-DD` format.
     */
    to_date ?: string;

    /**
     * Filter to a specific transaction type.
     */
    type ?: string;

    /**
     * Filter to a particular Envato Market site.
     */
    site ?: string;
};

export type GetDownloadLinkOptions = {
    item_id ?: number;
    purchase_code ?: string;
    shorten_url ?: boolean | 'true' | 'false';
};
