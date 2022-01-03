import { Client } from '../clients/client';
import { ItemSearchOptions, CommentSearchOptions } from '../types/options';
import { MarketName, Collection, Item, ItemConversation, ItemShort, ItemMedium } from '../types/api';

import url from '../util/url';
import mutate from '../util/mutate';
import errors from '../util/errors';

export class CatalogEndpoints {

    private _client: Client;

    public constructor(client: Client) {
        this._client = client;
    }

    /**
     * Returns details of, and items contained within, a public collection. Returns `undefined` if the specified
     * collection is not found.
     *
     * @param id The numeric ID of the collection to return.
     * @param page Page number.
     */
    public getCollection(id: number, page?: number) {
        return errors.find(this._client.get<ICollectionResponse>(url.build('/v3/market/catalog/collection', {
            id, page
        })));
    }

    /**
     * Returns all details of a particular item on Envato Market. Returns `undefined` if the specified item is not
     * found.
     *
     * @param id The numeric ID of the item to return.
     */
    public getItem(id: number) {
        return errors.find(this._client.get<Item>(url.build('/v3/market/catalog/item', {
            id
        })));
    }

    /**
     * Returns the latest available version of a theme/plugin. This is the recommended endpoint for Wordpress
     * theme/plugin authors building an auto-upgrade system into their item that needs to check if a new version is
     * available. Returns `undefined` if the specified item is not found.
     *
     * @param id The numeric ID of the item to return.
     */
    public getItemVersion(id: number) {
        return errors.find(this._client.get<IItemVersionResponse>(url.build('/v3/market/catalog/item-version', {
            id
        })));
    }

    /**
     * @param options The search options.
     */
    public searchItems(options: ItemSearchOptions = {}) {
        return this._client.get<ISearchItemsResponse>(url.build('/v1/discovery/search/search/item', options));
    }

    /**
     * @param options The search options.
     */
    public searchComments(options: CommentSearchOptions) {
        return this._client.get<ISearchCommentsResponse>(url.build('/v1/discovery/search/search/comment', options));
    }

    /**
     * Returns the popular files for a particular site.
     *
     * @param site Site.
     */
    public async getPopularItems(site: MarketName) : Promise<IPopularItemsResponse> {
        return mutate.scope(
            'popular',
            await this._client.get(url.prepare('/v1/market/popular:%s.json', site))
        );
    }

    /**
     * Lists the categories of a particular site.
     *
     * @param site Site.
     */
    public async getCategories(site: MarketName) : Promise<ICategoriesResponse> {
        return mutate.scope(
            'categories',
            await this._client.get(url.prepare('/v1/market/categories:%s.json', site))
        );
    }

    /**
     * Return available licenses and prices for the given item ID.
     *
     * @param id Item ID.
     */
    public async getItemPrices(id: number) : Promise<IItemPricesResponse> {
        return mutate.scope(
            'item-prices',
            await this._client.get(url.prepare('/v1/market/item-prices:%d.json', id))
        );
    }

    /**
     * New files, recently uploaded to a particular site.
     *
     * @param site Site.
     * @param category Category.
     */
    public async getNewFiles(site: MarketName, category: string) : Promise<ItemShort[]> {
        return mutate.scope(
            'new-files',
            await this._client.get(url.prepare('/v1/market/new-files:%s,%s.json', site, category))
        );
    }

    /**
     * Shows the current site features.
     *
     * @param site Site.
     */
    public async getFeatures(site: MarketName) : Promise<IFeaturesResponse> {
        return mutate.scope(
            'features',
            await this._client.get(url.prepare('/v1/market/features:%s.json', site))
        );
    }

    /**
     * Shows a random list of newly uploaded files from a particular site (i.e. like the homepage).
     *
     * **Note:** This doesn't actually appear to be random, but rather sorted by newest first. Could change in future
     * since the endpoint is officially intended to return random results.
     *
     * @param site Site.
     */
    public async getRandomNewFiles(site: MarketName) : Promise<ItemShort[]> {
        return mutate.scope(
            'random-new-files',
            await this._client.get(url.prepare('/v1/market/random-new-files:%s.json', site))
        );
    }

}

export interface ICollectionResponse {
    collection: Collection,
    items: Item[],
    pagination: {
        template: string;
        pages: number;
        page_size: number;
    }
};

export interface IItemVersionResponse {
    /**
     * Version of the latest Optional Wordpress Theme attachment available for item (if any).
     */
    wordpress_theme_latest_version ?: string;

    /**
     * Version of the latest Optional Wordpress Plugin attachment available for item (if any).
     */
    wordpress_plugin_latest_version ?: string;
};

export interface ISearchItemsResponse {
    took: number;
    matches: Item[];
    item: Item | null;
    timed_out: boolean;
    total_hits: number;
    links: {
        next_page_url: string | null;
        prev_page_url: string | null;
        first_page_url: string;
        last_page_url: string;
    },
    author_exists: boolean;
    aggregations: {
        [aggName: string]: any
    }[];
    suggestions: any[];
};

export interface ISearchCommentsResponse {
    took: number;
    matches: ItemConversation[];
    timed_out: boolean;
    total_hits: number;
    links: {
        next_page_url: string | null;
        prev_page_url: string | null;
        first_page_url: string;
        last_page_url: string;
    },
};

export interface IPopularItemsResponse {
    items_last_week: ItemShort[],
    items_last_three_months: ItemShort[],
    authors_last_month: {
        item: string;
        sales: string;
        url: string;
        image: string;
    }[];
};

export interface ICategoriesResponse extends Array<{
    name: string;
    path: string;
}> {};

export interface IItemPricesResponse extends Array<{
    license: string;
    price: string;
}> {};

export interface IFeaturesResponse {
    featured_file: ItemMedium;
    featured_author: {
        id: string;
        user: string;
        url: string;
        thumbnail: string;
    }
    free_file: ItemMedium;
};
