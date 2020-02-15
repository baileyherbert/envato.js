import { Client } from '../client';
import { MarketName } from '../types/api';
export declare class StatsEndpoints {
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
    getFilesPerCategory(site: MarketName): Promise<IFilesPerCategoryResponse>;
}
export interface IFilesPerCategoryResponse {
    category: string;
    number_of_files: string;
    url: string;
}
