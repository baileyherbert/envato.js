import { Client } from '../client';
import { Collection, Item, SearchItemsOptions, SearchCommentsOptions, ItemComment, ItemShort, ItemMedium } from '../types/catalog';
import { MarketName } from '../types/market';

import * as url from '../util/url';
import * as mutate from '../util/mutate';

export class CatalogClientGroup {

    public constructor(private client: Client) {}

    /**
     * Returns details of, and items contained within, a public collection.
     *
     * @param id The numeric ID of the collection to return.
     * @param page Page number.
     */
    public getCollection(id: number, page?: number) {
        return this.client.get<GetCollectionResponse>(url.build('/v3/market/catalog/collection', {
            id, page
        }));
    }

    /**
     * Returns all details of a particular item on Envato Market.
     *
     * @param id The numeric ID of the item to return.
     */
    public getItem(id: number) {
        return this.client.get<GetItemResponse>(url.build('/v3/market/catalog/item', {
            id
        }));
    }

    /**
     * Returns the latest available version of a theme/plugin. This is the recommended endpoint for Wordpress
     * theme/plugin authors building an auto-upgrade system into their item that needs to check if a new version is
     * available.
     *
     * @param id The numeric ID of the item to return.
     */
    public getItemVersion(id: number) {
        return this.client.get<GetItemVersionResponse>(url.build('/v3/market/catalog/item-version', {
            id
        }));
    }

    /**
     * @param options The search options.
     */
    public searchItems(options: SearchItemsOptions = {}) {
        return this.client.get<SearchItemsResponse>(url.build('/v1/discovery/search/search/item', options));
    }

    /**
     * @param options The search options.
     */
    public searchComments(options: SearchCommentsOptions) {
        return this.client.get<SearchCommentsResponse>(url.build('/v1/discovery/search/search/comment', options));
    }

    /**
     * Returns the popular files for a particular site.
     *
     * @param site Site.
     */
    public async getPopularItems(site: MarketName) : Promise<GetPopularItemsResponse> {
        return mutate.scope(
            'popular',
            await this.client.get<any>(url.prepare('/v1/market/popular:%s.json', site))
        );
    }

    /**
     * Lists the categories of a particular site.
     *
     * @param site Site.
     */
    public async getCategories(site: MarketName) : Promise<GetCategoriesResponse> {
        return mutate.scope(
            'categories',
            await this.client.get<any>(url.prepare('/v1/market/categories:%s.json', site))
        );
    }

    /**
     * Return available licenses and prices for the given item ID.
     *
     * @param id Item ID.
     */
    public async getItemPrices(id: number) : Promise<GetItemPricesResponse> {
        return mutate.scope(
            'item-prices',
            await this.client.get<any>(url.prepare('/v1/market/item-prices:%d.json', id))
        );
    }

    /**
     * New files, recently uploaded to a particular site.
     *
     * @param site Site.
     * @param category Category.
     */
    public async getNewFiles(site: MarketName, category: string) : Promise<GetNewFilesResponse> {
        return mutate.scope(
            'new-files',
            await this.client.get<any>(url.prepare('/v1/market/new-files:%s,%s.json', site, category))
        );
    }

    /**
     * Shows the current site features.
     *
     * @param site Site.
     */
    public async getFeatures(site: MarketName) : Promise<GetFeaturesResponse> {
        return mutate.scope(
            'features',
            await this.client.get<any>(url.prepare('/v1/market/features:%s.json', site))
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
    public async getRandomNewFiles(site: MarketName) : Promise<GetRandomNewFilesResponse> {
        return mutate.scope(
            'random-new-files',
            await this.client.get<any>(url.prepare('/v1/market/random-new-files:%s.json', site))
        );
    }

}

export type GetCollectionResponse = {
    collection: Collection,
    items: Item[],
    pagination: {
        template: string;
        pages: number;
        page_size: number;
    }
};

export type GetItemResponse = Item;

export type GetItemVersionResponse = {
    /**
     * Version of the latest Optional Wordpress Theme attachment available for item (if any).
     */
    wordpress_theme_latest_version ?: string;

    /**
     * Version of the latest Optional Wordpress Plugin attachment available for item (if any).
     */
    wordpress_plugin_latest_version ?: string;
};

export type SearchItemsResponse = {
    took: number;
    matches: Item[];
    item ?: Item;
    timed_out: boolean;
    total_hits: number;
    links: {
        next_page_url ?: string;
        prev_page_url ?: string;
        first_page_url ?: string;
        last_page_url ?: string;
    },
    author_exists: boolean;
    aggregations: {
        [aggName: string]: any
    }[];
    suggestions: any[];
};

export type SearchCommentsResponse = {
    took: number;
    matches: ItemComment[];
    timed_out: boolean;
    total_hits: number;
    links: {
        next_page_url ?: string;
        prev_page_url ?: string;
        first_page_url ?: string;
        last_page_url ?: string;
    },
};

export type GetPopularItemsResponse = {
    items_last_week: ItemShort[],
    items_last_three_months: ItemShort[],
    authors_last_month: {
        item: string;
        sales: string;
        url: string;
        image: string;
    }[];
};

export type GetCategoriesResponse = {
    name: string;
    path: string;
}[];

export type GetItemPricesResponse = {
    license: string;
    price: string;
}[];

export type GetNewFilesResponse = ItemShort[];

export type GetFeaturesResponse = {
    featured_file: ItemMedium;
    featured_author: {
        id: string;
        user: string;
        url: string;
        thumbnail: string;
    }
    free_file: ItemMedium;
};

export type GetRandomNewFilesResponse =  ItemShort[];
