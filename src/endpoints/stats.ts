import { Client } from '../clients/client';
import { MarketName } from '../types/api';

import url from '../util/url';
import mutate from '../util/mutate';

export class StatsEndpoints {

    private _client: Client;

    public constructor(client: Client) {
        this._client = client;
    }

    /**
     * Shows the total number of subscribed users to Envato Market.
     */
    public async getTotalUsers() {
        return parseInt(mutate.scope('total_users', mutate.scope(
            'total-users',
            await this._client.get(url.build('/v1/market/total-users.json'))
        )));
    }

    /**
     * Shows the total number of items available on Envato Market.
     */
    public async getTotalItems() {
        return parseInt(mutate.scope('total_items', mutate.scope(
            'total-items',
            await this._client.get(url.build('/v1/market/total-items.json'))
        )));
    }

    /**
     * Shows the total number of items available on Envato Market.
     *
     * @param site Site.
     */
    public async getFilesPerCategory(site: MarketName) : Promise<IFilesPerCategoryResponse> {
        return mutate.scope(
            'number-of-files',
            await this._client.get(url.prepare('/v1/market/number-of-files:%s.json', site))
        );
    }

}

export interface IFilesPerCategoryResponse extends Array<{
    category: string;
    number_of_files: string;
    url: string;
}> {};
