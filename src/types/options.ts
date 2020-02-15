import { MarketDomain } from './api';

// #region search

/**
 * Options used to search items on the marketplaces.
 */
export interface ItemSearchOptions {
    /**
     * The string to search for.
     */
    term ?: string;

    /**
     * The site to match.
     */
    site ?: MarketDomain,

    /**
     * Comma separated list of tags to match.
     */
    tags ?: string;

    /**
     * Category code to search for.
     */
    category ?: string;

    /**
     * The platform to match.
     */
    platform ?: string;

    /**
     * Frameworks or compatible software to match.
     */
    compatible_with ?: string;

    /**
     * Comma separated list of colors to match.
     */
    colors ?: string;

    /**
     * Comma separated list of sizes to match.
     */
    sizes ?: string;

    /**
     * A minimum photo size to match.
     */
    size ?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

    /**
     * Name of the sales bucket to filter by (see the aggregation sales result).
     */
    sales ?: string;

    /**
     * Minimum rating to filter by.
     */
    rating_min ?: number;

    /**
     * Minimum price to include, in whole dollars.
     */
    price_min ?: number;

    /**
     * Maximum price to include, in whole dollars.
     */
    price_max ?: number;

    /**
     * Prefered polygon count. Either a single polygon count or a range seperated by `-`.
     */
    poly_count ?: string;

    /**
     * The item type to match.
     */
    item_type ?: string;

    /**
     * Whether to include search suggestions.
     */
    suggest ?: boolean | 'true' | 'false';

    /**
     * Restrict items by original uploaded date.
     */
    date ?: 'this-year' | 'this-month' | 'this-week' | 'this-day';

    /**
     * Restrict items by updated date.
     */
    date_updated ?: 'this-year' | 'this-month' | 'this-week' | 'this-day';

    /**
     * Minimum video or audio length in the form, in seconds.
     */
    length_min ?: number;

    /**
     * Maximum video or audio length in the form, in seconds.
     */
    length_max ?: number;

    /**
     * One of very-slow, slow, medium, upbeat, fast and very-fast.
     */
    tempo ?: 'very-slow' | 'slow' | 'medium' | 'upbeat' | 'fast' | 'very-fast';

    /**
     * Does the graphic include an alpha mask?
     */
    alpha ?: boolean | 'true' | 'false';

    /**
     * The type of vocal content in audio files, comma seperated, valid values:
     *
     * - `'background vocals'`
     * - `'background vocals/harmonies'`
     * - `'lead vocals'`
     * - `'instrumental version included'`
     * - `'vocal samples'`
     * - `'no vocals'`
     */
    vocals_in_audio ?: string;

    /**
     * Does the item loop seamlessly?
     */
    looped ?: boolean | 'true' | 'false';

    /**
     * Image or video orientation to match.
     */
    orientation ?: 'landscape' | 'portrait' | 'square';

    /**
     * Restrict to items that do or don't require plugins.
     */
    requires_plugins ?: 'T' | 'F';

    /**
     * The minimum resolution for video content.
     */
    resolution_min ?: '720p' | '1080p' | '2K' | '4K';

    /**
     * Match a particular FPS value for video content.
     */
    frame_rate ?: string;

    /**
     * Page number (max. 60).
     */
    page ?: number;

    /**
     * Number of items per page (max. 100).
     */
    page_size ?: number;

    /**
     * The name of the attribute to search by, eg: `'compatible-with'`.
     */
    attribute_key ?: string;

    /**
     * The attribute value to match, eg: `'Wordpress 3.5'`.
     */
    attribute_value ?: string | number;

    /**
     * Username to restrict by.
     */
    username ?: string;

    /**
     * How to sort the results.
     */
    sort_by ?: 'relevance' | 'rating' | 'sales' | 'price' | 'date' | 'updated' | 'category' | 'name' | 'trending' | 'featured_until';

    /**
     * Sort direction.
     */
    sort_direction ?: 'asc' | 'desc';
}

/**
 * Options used to search comments.
 */
export interface CommentSearchOptions {
    /**
     * The item id to search for comments on.
     */
    item_id: string;

    /**
     * The search phrase to find.
     */
    term ?: string;

    /**
     * Page number (max. 60).
     */
    page ?: number;

    /**
     * Number of items per page (max. 100).
     */
    page_size ?: number;

    /**
     * How to sort results.
     */
    sort_by ?: 'relevance' | 'newest' | 'oldest';
}

// #endregion

// #region author

/**
 * Options used when searching for or retrieving statements.
 */
export interface StatementOptions {
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

// #endregion

// #region buyer

/**
 * Options used to retrieve a purchase on a buyer's account.
 */
export interface ListPurchasesOptions {
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

/**
 * Options used when retrieving a download link to a purchase.
 */
export interface DownloadLinkOptions {
    item_id ?: number;
    purchase_code ?: string;
    shorten_url ?: boolean | 'true' | 'false';
};

// #endregion
