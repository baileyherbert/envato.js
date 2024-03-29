import { Client } from '../clients/client';
import { MarketName, Collection, Item, ItemMedium } from '../types/api';

import url from '../util/url';
import mutate from '../util/mutate';
import errors from '../util/errors';

export class UserEndpoints {

    private _client: Client;

    public constructor(client: Client) {
        this._client = client;
    }

    /**
     * Lists all of the user's private and public collections.
     */
    public async getCollections() : Promise<Collection[]> {
        return mutate.scope(
            'collections',
            await this._client.get(url.build('/v3/market/user/collections'))
        );
    }

    /**
     * Returns details and items for public or the user's private collections. Returns `undefined` if the specified
     * collection is not found.
     *
     * @param id The numeric ID of the collection to return.
     */
    public getPrivateCollection(id: number) {
        return errors.find(this._client.get<IPrivateCollectionResponse>(url.build('/v3/market/user/collection', {
            id
        })));
    }

    /**
     * Shows username, country, number of sales, number of followers, location and image for a user.
     *
     * @param username Username.
     */
    public async getAccountDetails(username: string) : Promise<IAccountDetailsResponse> {
        return mutate.scope(
            'user',
            await this._client.get(url.prepare('/v1/market/user:%s.json', username))
        );
    }

    /**
     * Shows a list of badges for the given user.
     *
     * @param username Username.
     */
    public async getBadges(username: string) : Promise<IBadgesResponse> {
        return mutate.scope(
            'user-badges',
            await this._client.get(url.prepare('/v1/market/user-badges:%s.json', username))
        );
    }

    /**
     * Show the number of items an author has for sale on each site.
     *
     * @param username Username.
     */
    public async getItemsBySite(username: string) : Promise<IItemsBySiteResponse> {
        return mutate.scope(
            'user-items-by-site',
            await this._client.get(url.prepare('/v1/market/user-items-by-site:%s.json', username))
        );
    }

    /**
     * Shows up to 1000 newest files uploaded by a user to a particular site.
     *
     * @param username Username.
     * @param site Site.
     */
    public async getNewItems(username: string, site: MarketName) : Promise<ItemMedium[]> {
        return mutate.scope(
            'new-files-from-user',
            await this._client.get(url.prepare('/v1/market/new-files-from-user:%s,%s.json', username, site))
        );
    }

}

export interface IPrivateCollectionResponse {
    collection: Collection;
    items: Item[];
};

export interface IAccountDetailsResponse {
    /**
     * The user's username.
     */
    username: string;

    /**
     * The user's country. This will be a blank string if the user has made it private.
     */
    country: string;

    /**
     * The number of total sales for the user. This is a plain, unformatted number sent as a string.
     */
    sales: string;

    /**
     * The location of the user. I'm not sure where this comes from, but it seems customizable by the user
     * and is not guaranteed to be a location. This will be a blank string if the user has made it private.
     */
    location: string;

    /**
     * An absolute URL to the user's avatar. If the user has no avatar, this will be the default avatar's URL.
     */
    image: string;

    /**
     * An absolute URL to the user's banner. If the user has no avatar, this will be the default banner's URL.
     */
    homepage_image: string;

    /**
     * The total number of people following this user. This is a plain, unformatted number sent as a string.
     */
    followers: string;
};

export interface IBadgesResponse extends Array<{
    /**
     * A unique identifier for the badge, typically in a format like `"author_level_6"`.
     */
    name: string;

    /**
     * The display name of the badge.
     */
    label: string;

    /**
     * An absolute URL to the badge's image (in SVG format).
     */
    image: string;
}> {};

export interface IItemsBySiteResponse extends Array<{
    /**
     * The name of the marketplace (e.g. `"CodeCanyon"`).
     */
    site: string;

    /**
     * The number of items as a plain, unformatted number within a string.
     */
    items: string;
}> {};
