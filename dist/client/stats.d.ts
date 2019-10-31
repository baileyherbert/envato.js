import { MarketName } from '../types/market';
import { Client } from '../client';
export declare class StatsClientGroup {
    private client;
    constructor(client: Client);
    /**
     * Shows the total number of subscribed users to Envato Market.
     */
    getTotalUsers(): Promise<number>;
    /**
     * Shows the total number of items available on Envato Market.
     */
    getTotalItems(): Promise<number>;
    /**
     * Shows the total number of items available on Envato Market.
     *
     * @param site Site.
     */
    getFilesPerCategory(site: MarketName): Promise<GetFilesPerCategoryResponse>;
}
export declare type GetTotalUsersResponse = {
    'total-users': {
        total_users: string;
    };
};
export declare type GetTotalItemsResponse = {
    'total-items': {
        total_items: string;
    };
};
export declare type GetFilesPerCategoryResponse = {
    category: string;
    number_of_files: string;
    url: string;
}[];
