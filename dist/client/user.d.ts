import { Client } from '../client';
import { Collection, Item, ItemMedium } from '../types/catalog';
import { MarketName } from '../types/market';
export declare class UserClientGroup {
    private client;
    constructor(client: Client);
    /**
     * Lists all of the user's private and public collections.
     */
    getCollections(): Promise<GetCollectionsResponse>;
    /**
     * Returns details and items for public or the user's private collections.
     *
     * @param id The numeric ID of the collection to return.
     */
    getPrivateCollection(id: number): Promise<GetPrivateCollectionResponse>;
    /**
     * Shows username, country, number of sales, number of followers, location and image for a user.
     *
     * @param username Username.
     */
    getAccountDetails(username: string): Promise<GetAccountDetailsResponse>;
    /**
     * Shows a list of badges for the given user.
     *
     * @param username Username.
     */
    getBadges(username: string): Promise<GetBadgesResponse>;
    /**
     * Show the number of items an author has for sale on each site.
     *
     * @param username Username.
     */
    getItemsBySite(username: string): Promise<GetItemsBySiteResponse>;
    /**
     * Shows up to 1000 newest files uploaded by a user to a particular site.
     *
     * @param username Username.
     * @param site Site.
     */
    getNewItems(username: string, site: MarketName): Promise<GetNewItemsResponse>;
}
export declare type GetCollectionsResponse = Collection[];
export declare type GetPrivateCollectionResponse = {
    collection: Collection;
    items: Item[];
};
export declare type GetAccountDetailsResponse = {
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
export declare type GetBadgesResponse = {
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
}[];
export declare type GetItemsBySiteResponse = {
    /**
     * The name of the marketplace (e.g. `"CodeCanyon"`).
     */
    site: string;
    /**
     * The number of items as a plain, unformatted number within a string.
     */
    items: string;
}[];
export declare type GetNewItemsResponse = ItemMedium[];
