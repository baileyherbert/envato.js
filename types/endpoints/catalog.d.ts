import { Client } from '../client';
import { ItemSearchOptions, CommentSearchOptions } from '../types/options';
import { MarketName, Collection, Item, ItemComment, ItemShort, ItemMedium } from '../types/api';
export declare class CatalogEndpoints {
    constructor(client: Client);
    /**
     * Returns details of, and items contained within, a public collection. Returns `undefined` if the specified
     * collection is not found.
     *
     * @param id The numeric ID of the collection to return.
     * @param page Page number.
     */
    getCollection(id: number, page?: number): Promise<ICollectionResponse | undefined>;
    /**
     * Returns all details of a particular item on Envato Market. Returns `undefined` if the specified item is not
     * found.
     *
     * @param id The numeric ID of the item to return.
     */
    getItem(id: number): Promise<Item | undefined>;
    /**
     * Returns the latest available version of a theme/plugin. This is the recommended endpoint for Wordpress
     * theme/plugin authors building an auto-upgrade system into their item that needs to check if a new version is
     * available. Returns `undefined` if the specified item is not found.
     *
     * @param id The numeric ID of the item to return.
     */
    getItemVersion(id: number): Promise<IItemVersionResponse | undefined>;
    /**
     * @param options The search options.
     */
    searchItems(options?: ItemSearchOptions): Promise<ISearchItemsResponse>;
    /**
     * @param options The search options.
     */
    searchComments(options: CommentSearchOptions): Promise<ISearchCommentsResponse>;
    /**
     * Returns the popular files for a particular site.
     *
     * @param site Site.
     */
    getPopularItems(site: MarketName): Promise<IPopularItemsResponse>;
    /**
     * Lists the categories of a particular site.
     *
     * @param site Site.
     */
    getCategories(site: MarketName): Promise<ICategoriesResponse>;
    /**
     * Return available licenses and prices for the given item ID.
     *
     * @param id Item ID.
     */
    getItemPrices(id: number): Promise<IItemPricesResponse>;
    /**
     * New files, recently uploaded to a particular site.
     *
     * @param site Site.
     * @param category Category.
     */
    getNewFiles(site: MarketName, category: string): Promise<ItemShort[]>;
    /**
     * Shows the current site features.
     *
     * @param site Site.
     */
    getFeatures(site: MarketName): Promise<IFeaturesResponse>;
    /**
     * Shows a random list of newly uploaded files from a particular site (i.e. like the homepage).
     *
     * **Note:** This doesn't actually appear to be random, but rather sorted by newest first. Could change in future
     * since the endpoint is officially intended to return random results.
     *
     * @param site Site.
     */
    getRandomNewFiles(site: MarketName): Promise<ItemShort[]>;
}
export interface ICollectionResponse {
    collection: Collection;
    items: Item[];
    pagination: {
        template: string;
        pages: number;
        page_size: number;
    };
}
export interface IItemVersionResponse {
    /**
     * Version of the latest Optional Wordpress Theme attachment available for item (if any).
     */
    wordpress_theme_latest_version?: string;
    /**
     * Version of the latest Optional Wordpress Plugin attachment available for item (if any).
     */
    wordpress_plugin_latest_version?: string;
}
export interface ISearchItemsResponse {
    took: number;
    matches: Item[];
    item?: Item;
    timed_out: boolean;
    total_hits: number;
    links: {
        next_page_url?: string;
        prev_page_url?: string;
        first_page_url?: string;
        last_page_url?: string;
    };
    author_exists: boolean;
    aggregations: {
        [aggName: string]: any;
    }[];
    suggestions: any[];
}
export interface ISearchCommentsResponse {
    took: number;
    matches: ItemComment[];
    timed_out: boolean;
    total_hits: number;
    links: {
        next_page_url?: string;
        prev_page_url?: string;
        first_page_url?: string;
        last_page_url?: string;
    };
}
export interface IPopularItemsResponse {
    items_last_week: ItemShort[];
    items_last_three_months: ItemShort[];
    authors_last_month: {
        item: string;
        sales: string;
        url: string;
        image: string;
    }[];
}
export interface ICategoriesResponse {
    name: string;
    path: string;
}
export interface IItemPricesResponse {
    license: string;
    price: string;
}
export interface IFeaturesResponse {
    featured_file: ItemMedium;
    featured_author: {
        id: string;
        user: string;
        url: string;
        thumbnail: string;
    };
    free_file: ItemMedium;
}
