import { MarketName } from '../types/market';
import { Client } from '../client';

import * as url from '../util/url';
import * as mutate from '../util/mutate';

export class StatsClientGroup {

    public constructor(private client: Client) {}

    /**
     * Shows the total number of subscribed users to Envato Market.
     */
    public async getTotalUsers() {
        return parseInt(mutate.scope('total_users', mutate.scope(
            'total-users',
            await this.client.get<GetTotalUsersResponse>(url.build('/v1/market/total-users.json'))
        )));
    }

    /**
     * Shows the total number of items available on Envato Market.
     */
    public async getTotalItems() {
        return parseInt(mutate.scope('total_items', mutate.scope(
            'total-items',
            await this.client.get<GetTotalItemsResponse>(url.build('/v1/market/total-items.json'))
        )));
    }

    /**
     * Shows the total number of items available on Envato Market.
     *
     * @param site Site.
     */
    public async getFilesPerCategory(site: MarketName) : Promise<GetFilesPerCategoryResponse> {
        return mutate.scope(
            'number-of-files',
            await this.client.get<any>(url.prepare('/v1/market/number-of-files:%s.json', site))
        );
    }

}

export type GetTotalUsersResponse = {
    'total-users': {
        total_users: string;
    }
};

export type GetTotalItemsResponse = {
    'total-items': {
        total_items: string;
    }
};

export type GetFilesPerCategoryResponse = {
    category: string;
    number_of_files: string;
    url: string;
}[];
