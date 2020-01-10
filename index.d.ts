/// <reference types="node" />

import request = require('request');
import events = require('events');

declare namespace envato {
    class Client extends events.EventEmitter {
        constructor(token: string);
        constructor(options: ClientOptions);

        /**
         * The current access token for the client, which may either be an OAuth access token or a personal token.
         */
        get token(): string;

        /**
         * The refresh token if one was provided when the client was instantiated. The refresh token is only applicable to
         * OAuth sessions and is used by the client to predict the expiration of access tokens for faster regeneration.
         *
         * If a refresh token is not known or available, this will be `undefined`.
         */
        get refreshToken(): string;

        /**
         * The timestamp (in milliseconds) when the current token expires. This will be `undefined` if the client was not
         * instantiated with an expiration time.
         */
        get expiration(): number | Date;

        /**
         * This will be  `true` if this token has expired. This will always return `false` if the client was not
         * instantiated with an expiration time.
         */
        get expired(): boolean;

        /**
         * The number of milliseconds remaining until the current token expires. This can become negative if the expiration
         * time is in the past. If an expiration time is not set on the client, this will be `undefined`.
         */
        get ttl(): number;

        /**
         * Returns the identity of the current token, which includes the account id, a list of all granted permissions, and
         * the number of seconds until the token expires.
         */
        getIdentity(): Promise<IdentityResponse>;

        /**
         * A collection of endpoints for browsing the Envato Market catalog.
         */
        get catalog(): CatalogClientGroup;

        /**
         * A collection of endpoints for accessing private details about the current user.
         */
        get private(): PrivateClientGroup;

        /**
         * A collection of endpoints for accessing public details about users.
         */
        get user(): UserClientGroup;

        /**
         * A collection of endpoints for retrieving general statistics about the marketplaces.
         */
        get stats(): StatsClientGroup;

        /**
         * Sends a `GET` request to the given path on the API and returns the parsed response.
         *
         * @param path The path to query (such as `"/catalog/item"`).
         */
        get<T = Object>(path: string): Promise<T>;

        /**
         * Sends a `POST` request to the given path on the API and returns the parsed response.
         *
         * @param path The path to query (such as `"/catalog/item"`).
         * @param params The posted parameters to send with the request.
         */
        post<T = Object>(path: string, params?: {
            [name: string]: any;
        }): Promise<T>;

        /**
         * Sends a `PUT` request to the given path on the API and returns the parsed response.
         *
         * @param path The path to query (such as `"/catalog/item"`).
         * @param params The posted parameters to send with the request.
         */
        put<T = Object>(path: string, params?: {
            [name: string]: any;
        }): Promise<T>;

        /**
         * Sends a `PATCH` request to the given path on the API and returns the parsed response.
         *
         * @param path The path to query (such as `"/catalog/item"`).
         * @param params The posted parameters to send with the request.
         */
        patch<T = Object>(path: string, params?: {
            [name: string]: any;
        }): Promise<T>;

        /**
         * Sends a `DELETE` request to the given path on the API and returns the parsed response.
         *
         * @param path The path to query (such as `"/catalog/item"`).
         * @param params The posted parameters to send with the request.
         */
        delete<T = Object>(path: string, params?: {
            [name: string]: any;
        }): Promise<T>;

        on(event: 'debug', listener: (err: Error | undefined, response: request.Response, body: string) => void): this;
        on(event: 'renew', listener: (data: RefreshedToken) => void): this;
    }

    interface ClientOptions {
        /**
         * The token to use for authorization. Acceptable values include:
         *
         * - Personal tokens.
         * - Access tokens (OAuth).
         */
        token: string;

        /**
         * The user agent string to send with requests. This should briefly explain what your app is or its purpose.
         * Please do not use a generic browser user agent.
         *
         * Here are some examples of good user agents:
         *
         * - `"License activation for my themes"`
         * - `"Support forum authentication & license verification"`
         * - `"Gathering data on items"`
         */
        userAgent?: string;

        /**
         * For OAuth sessions, you may optionally provide the refresh token to enable automatic token renewal when the
         * current access token expires. You must also supply the `expiration` option when providing this option.
         */
        refreshToken?: string;

        /**
         * For OAuth sessions, you should provide a timestamp representing the time when the access token expires as a
         * number (in milliseconds) or a `Date`. The client will automatically generate a new access token using the
         * `refreshToken` option after the expiration time is reached, as long as the `oauth` option is provided.
         *
         * **Note:** If you need to store newly generated access tokens, listen for the `renew` event on the client.
         */
        expiration?: Date | number;

        /**
         * The OAuth helper instance to use for automatically refreshing access tokens.
         */
        oauth?: OAuth;

        /**
         * Optional configuration for the underlying `request` library.
         */
        request?: request.CoreOptions;
    }

    interface IdentityResponse {
        /**
         * The client ID of the application, if this is an OAuth session. Otherwise, this is `null`.
         */
        clientId?: string;

        /**
         * The unique ID of the user who is authorized by the current token.
         */
        userId: number;

        /**
         * A list of permissions (scopes) the current token has been granted.
         */
        scopes: string[];

        /**
         * The number of seconds remaining until the current token expires. This will always be `315360000` for personal
         * tokens as they are indefinitely valid.
         */
        ttl: number;
    }

    class OAuth {
        private options;
        constructor(options: OAuthOptions);
        getRedirectUrl(): string;

        /**
         * Authorizes the user based on the given authentication code and returns a `Client` with their access token,
         * refresh token, and expiration time configured and ready-to-go.
         *
         * @param code The single-use authentication code returned from the Envato authorization screen.
         */
        getClient(code: string): Promise<Client>;

        /**
         * Returns a new access token for the given client.
         *
         * @param client The client whose access token needs to be renewed.
         */
        renew(client: Client): Promise<RefreshedToken>;
    }

    interface OAuthOptions {
        /**
         * The application's unique ID.
         */
        client_id: string;

        /**
         * The application's secret.
         */
        client_secret: string;

        /**
         * The application's redirect URL. This must exactly match the URL provided when creating the application.
         */
        redirect_uri: string;

        /**
         * The user agent string to send with requests. This should briefly explain what your app is or its purpose.
         * Please do not use a generic browser user agent. Note that this also applies to `Client` instances generated by
         * the OAuth helper.
         *
         * Here are some examples of good user agents:
         *
         * - `"License activation for my themes"`
         * - `"Support forum authentication & license verification"`
         * - `"Gathering data on items"`
         */
        userAgent?: string;

        /**
         * Optional configuration for the underlying `request` library.
         */
        request?: request.CoreOptions;
    }

    interface RefreshedToken {
        token: string;
        expiration: number;
        [key: string]: any;
    }

    class CatalogClientGroup {
        private client;
        constructor(client: Client);

        /**
         * Returns details of, and items contained within, a public collection.
         *
         * @param id The numeric ID of the collection to return.
         * @param page Page number.
         */
        getCollection(id: number, page?: number): Promise<GetCollectionResponse>;

        /**
         * Returns all details of a particular item on Envato Market.
         *
         * @param id The numeric ID of the item to return.
         */
        getItem(id: number): Promise<Item>;

        /**
         * Returns the latest available version of a theme/plugin. This is the recommended endpoint for Wordpress
         * theme/plugin authors building an auto-upgrade system into their item that needs to check if a new version is
         * available.
         *
         * @param id The numeric ID of the item to return.
         */
        getItemVersion(id: number): Promise<GetItemVersionResponse>;

        /**
         * @param options The search options.
         */
        searchItems(options?: SearchItemsOptions): Promise<SearchItemsResponse>;

        /**
         * @param options The search options.
         */
        searchComments(options: SearchCommentsOptions): Promise<SearchCommentsResponse>;

        /**
         * Returns the popular files for a particular site.
         *
         * @param site Site.
         */
        getPopularItems(site: MarketName): Promise<GetPopularItemsResponse>;

        /**
         * Lists the categories of a particular site.
         *
         * @param site Site.
         */
        getCategories(site: MarketName): Promise<GetCategoriesResponse>;

        /**
         * Return available licenses and prices for the given item ID.
         *
         * @param id Item ID.
         */
        getItemPrices(id: number): Promise<GetItemPricesResponse>;

        /**
         * New files, recently uploaded to a particular site.
         *
         * @param site Site.
         * @param category Category.
         */
        getNewFiles(site: MarketName, category: string): Promise<GetNewFilesResponse>;

        /**
         * Shows the current site features.
         *
         * @param site Site.
         */
        getFeatures(site: MarketName): Promise<GetFeaturesResponse>;

        /**
         * Shows a random list of newly uploaded files from a particular site (i.e. like the homepage).
         *
         * **Note:** This doesn't actually appear to be random, but rather sorted by newest first. Could change in future
         * since the endpoint is officially intended to return random results.
         *
         * @param site Site.
         */
        getRandomNewFiles(site: MarketName): Promise<GetRandomNewFilesResponse>;
    }

    interface GetCollectionResponse {
        collection: Collection;
        items: Item[];
        pagination: {
            template: string;
            pages: number;
            page_size: number;
        };
    }

    type GetItemResponse = Item;

    interface GetItemVersionResponse {
        /**
         * Version of the latest Optional Wordpress Theme attachment available for item (if any).
         */
        wordpress_theme_latest_version?: string;

        /**
         * Version of the latest Optional Wordpress Plugin attachment available for item (if any).
         */
        wordpress_plugin_latest_version?: string;
    }

    interface SearchItemsResponse {
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

    interface SearchCommentsResponse {
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

    interface GetPopularItemsResponse {
        items_last_week: ItemShort[];
        items_last_three_months: ItemShort[];
        authors_last_month: {
            item: string;
            sales: string;
            url: string;
            image: string;
        }[];
    }

    type GetCategoriesResponse = {
        name: string;
        path: string;
    }[];

    type GetItemPricesResponse = {
        license: string;
        price: string;
    }[];

    type GetNewFilesResponse = ItemShort[];

    type GetFeaturesResponse = {
        featured_file: ItemMedium;
        featured_author: {
            id: string;
            user: string;
            url: string;
            thumbnail: string;
        };
        free_file: ItemMedium;
    }

    type GetRandomNewFilesResponse = ItemShort[];

    class PrivateClientGroup {
        private client;
        constructor(client: Client);

        /**
         * Lists all unrefunded sales of the authenticated user's items listed on Envato Market. Author sales data
         * ("Amount") is reported before subtraction of any income taxes (eg US Royalty Withholding Tax).
         *
         * @param page A page number to start the results from.
         */
        getSales(page?: number): Promise<GetSalesResponse>;

        /**
         * Returns the details of an author's sale identified by the purchase code. Author sales data ("Amount") is reported
         * before subtraction of any income taxes (eg US Royalty Withholding Tax).
         *
         * @param code The unique code of the sale to return.
         */
        getSale(code: string): Promise<GetSaleResponse>;

        /**
         * List purchases.
         *
         * @param code The unique code of the sale to return.
         */
        getPurchases(options: GetPurchasesOptions): Promise<GetPurchasesResponse>;

        /**
         * Lists all purchases that the authenticated user has made of the app creator's listed items. Only works
         * with OAuth tokens.
         *
         * @param page A page number to start the results from.
         */
        getPurchasesFromAppCreator(page?: number): Promise<GetPurchasesFromAppCreatorResponse>;

        /**
         * Returns the details of a user's purchase identified by the purchase code.
         *
         * @param code The unique code of the purchase to return.
         * @deprecated The `purchase:history` permission is deprecated, please use `purchase:verify` instead.
         */
        getPurchase(code: string): Promise<GetPurchaseResponse>;

        /**
         * Returns the first name, surname, earnings available to withdraw, total deposits, balance (deposits + earnings)
         * and country.
         */
        getAccountDetails(): Promise<GetPrivateAccountDetailsResponse>;

        /**
         * Returns the currently logged in user's Envato Account username.
         */
        getUsername(): Promise<string>;

        /**
         * Returns the currently logged in user's email address.
         */
        getEmail(): Promise<string>;

        /**
         * Returns the monthly sales data, as displayed on the user's earnings page. Monthly sales data ("Earnings") is
         * reported before subtraction of any income taxes (eg US Royalty Withholding Tax).
         */
        getMonthlySales(): Promise<GetMonthlySalesResponse>;

        /**
         * Lists transactions from the user's statement page.
         */
        getStatement(options: GetStatementOptions): Promise<GetStatementResponse>;

        /**
         * Download purchased items by either the item_id or the purchase_code. Each invocation of this endpoint will count
         * against the items daily download limit.
         */
        getDownloadLink(options: GetDownloadLinkOptions): Promise<string>;
    }

    type GetSalesResponse = Sale[];

    type GetSaleResponse = Sale & {
        /**
         * The username of the buyer. Note that this can be `null` if the item was purchased via guest checkout.
         */
        buyer?: string;

        /**
         * The number of times this buyer has purchased the item.
         */
        purchase_count: number;
    };

    type GetPurchasesResponse = {
        count: number;
        results: (Sale & {
            code: string;
        })[];
    };

    type GetPurchasesFromAppCreatorResponse = {
        buyer: {
            id: number;
            username: string;
        };
        author: {
            id: number;
            username: string;
        };
        purchases: (Sale & {
            code: string;
        })[];
    };

    type GetPurchaseResponse = Sale & {
        code: string;
    };

    type GetPrivateAccountDetailsResponse = {
        image: string;
        firstname: string;
        surname: string;
        available_earnings: string;
        total_deposits: string;
        balance: string;
        country: string;
    };

    type GetUsernameResponse = {
        username: string;
    };

    type GetEmailResponse = {
        email: string;
    };

    type GetMonthlySalesResponse = {
        /**
         * The month as a timestamp (format: `"Mon Apr 01 00:00:00 +1100 2013"`).
         */
        month: string;
        /**
         * The number of sales for this month as an unformatted integer in a string.
         */
        sales: string;
        /**
         * The total earnings from sales this month as a double in a string (e.g. `"652.45"`).
         */
        earnings: string;
    }[];

    type GetStatementResponse = {
        count: number;
        results: {
            unique_id: string;
            date: string;
            order_id?: number;
            type: string;
            detail: string;
            item_id?: number;
            document?: string;
            price?: number;
            au_gst?: number;
            eu_vat?: number;
            us_rwt?: number;
            us_bwt?: number;
            amount: number;
            site?: MarketDomain;
            other_party_country?: string;
            other_party_region?: string;
            other_party_city?: string;
            other_party_zipcode?: string;
        }[];
    };

    type GetDownloadLinkResponse = {
        download_url: string;
    };

    class StatsClientGroup {
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

    type GetTotalUsersResponse = {
        'total-users': {
            total_users: string;
        };
    };

    type GetTotalItemsResponse = {
        'total-items': {
            total_items: string;
        };
    };

    type GetFilesPerCategoryResponse = {
        category: string;
        number_of_files: string;
        url: string;
    }[];

    class UserClientGroup {
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

    type GetCollectionsResponse = Collection[];

    type GetPrivateCollectionResponse = {
        collection: Collection;
        items: Item[];
    };

    type GetAccountDetailsResponse = {
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

    type GetBadgesResponse = {
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

    type GetItemsBySiteResponse = {
        /**
         * The name of the marketplace (e.g. `"CodeCanyon"`).
         */
        site: string;

        /**
         * The number of items as a plain, unformatted number within a string.
         */
        items: string;
    }[];

    type GetNewItemsResponse = ItemMedium[];

    type Collection = {
        id: number;
        name: string;
        description: string;
        private: boolean;
        item_count: number;
        special_role?: string;
        image: string;
    };

    type Item = {
        id: number;
        name: string;
        number_of_sales: number;
        author_username: string;
        author_url: string;
        url: string;
        updated_at: string;
        attributes: Attribute[];
        description: string;
        site: MarketDomain;
        classification: string;
        classification_url: string;
        price_cents: number;
        author_image: string;
        summary: string;
        wordpress_theme_metadata?: {
            theme_name: string;
            author_name: string;
            version: string;
            description: string;
        };
        rating: number;
        rating_count: number;
        published_at: string;
        trending: boolean;
        tags: string[];
        previews: {
            thumbnail_preview?: {
                small_url: string;
                large_url: string;
                large_width: number;
                large_height: number;
            };
            icon_with_thumbnail_preview?: {
                icon_url: string;
                thumbnail_url: string;
                thumbnail_width: number;
                thumbnail_height: number;
            };
            icon_with_landscape_preview?: {
                icon_url: string;
                landscape_url: string;
            };
            icon_with_square_preview?: {
                icon_url: string;
                square_url: string;
                image_urls: Image[];
            };
            icon_with_audio_preview?: {
                icon_url: string;
                mp3_url: string;
                mp3_preview_download_url?: string;
                mp3_id: string;
                length: {
                    hours: number;
                    minutes: number;
                    seconds: number;
                };
            };
            icon_with_video_preview?: {
                icon_url: string;
                landscape_url: string;
                video_url: string;
                type: string;
            };
            live_site?: {
                url: string;
            };
            icon_preview?: {
                icon_url: string;
                type: string;
            };
            landscape_preview?: {
                landscape_url: string;
                image_urls?: Image[];
            };
        };
    };

    type Image = {
        name?: string;
        url: string;
        width: number;
        height: number;
    };

    type ItemShort = {
        id: number;
        item: string;
        url: string;
        user: string;
        thumbnail: string;
        sales: string;
        rating: string;
        rating_decimal: string;
        cost: string;
    };

    type ItemMedium = ItemShort & {
        uploaded_on: string;
        last_update: string;
        tags: string;
        category: string;
        live_preview_url: string;
    };

    type Attribute = {
        name: string;
        value: string | string[];
        label: string;
    };

    type SearchItemsOptions = {
        /**
         * The string to search for.
         */
        term?: string;

        /**
         * The site to match.
         */
        site?: MarketDomain;

        /**
         * Comma separated list of tags to match.
         */
        tags?: string;

        /**
         * Category code to search for.
         */
        category?: string;

        /**
         * The platform to match.
         */
        platform?: string;

        /**
         * Frameworks or compatible software to match.
         */
        compatible_with?: string;

        /**
         * Comma separated list of colors to match.
         */
        colors?: string;

        /**
         * Comma separated list of sizes to match.
         */
        sizes?: string;

        /**
         * A minimum photo size to match.
         */
        size?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

        /**
         * Name of the sales bucket to filter by (see the aggregation sales result).
         */
        sales?: string;

        /**
         * Minimum rating to filter by.
         */
        rating_min?: number;

        /**
         * Minimum price to include, in whole dollars.
         */
        price_min?: number;

        /**
         * Maximum price to include, in whole dollars.
         */
        price_max?: number;

        /**
         * Prefered polygon count. Either a single polygon count or a range seperated by `-`.
         */
        poly_count?: string;

        /**
         * The item type to match.
         */
        item_type?: string;

        /**
         * Whether to include search suggestions.
         */
        suggest?: boolean | 'true' | 'false';

        /**
         * Restrict items by original uploaded date.
         */
        date?: 'this-year' | 'this-month' | 'this-week' | 'this-day';

        /**
         * Restrict items by updated date.
         */
        date_updated?: 'this-year' | 'this-month' | 'this-week' | 'this-day';

        /**
         * Minimum video or audio length in the form, in seconds.
         */
        length_min?: number;

        /**
         * Maximum video or audio length in the form, in seconds.
         */
        length_max?: number;

        /**
         * One of very-slow, slow, medium, upbeat, fast and very-fast.
         */
        tempo?: 'very-slow' | 'slow' | 'medium' | 'upbeat' | 'fast' | 'very-fast';

        /**
         * Does the graphic include an alpha mask?
         */
        alpha?: boolean | 'true' | 'false';

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
        vocals_in_audio?: string;

        /**
         * Does the item loop seamlessly?
         */
        looped?: boolean | 'true' | 'false';

        /**
         * Image or video orientation to match.
         */
        orientation?: 'landscape' | 'portrait' | 'square';

        /**
         * Restrict to items that do or don't require plugins.
         */
        requires_plugins?: 'T' | 'F';

        /**
         * The minimum resolution for video content.
         */
        resolution_min?: '720p' | '1080p' | '2K' | '4K';

        /**
         * Match a particular FPS value for video content.
         */
        frame_rate?: string;

        /**
         * Page number (max. 60).
         */
        page?: number;

        /**
         * Number of items per page (max. 100).
         */
        page_size?: number;

        /**
         * The name of the attribute to search by, eg: `'compatible-with'`.
         */
        attribute_key?: string;

        /**
         * The attribute value to match, eg: `'Wordpress 3.5'`.
         */
        attribute_value?: string | number;

        /**
         * Username to restrict by.
         */
        username?: string;

        /**
         * How to sort the results.
         */
        sort_by?: 'relevance' | 'rating' | 'sales' | 'price' | 'date' | 'updated' | 'category' | 'name' | 'trending' | 'featured_until';

        /**
         * Sort direction.
         */
        sort_direction?: 'asc' | 'desc';
    };

    type SearchCommentsOptions = {
        /**
         * The item id to search for comments on.
         */
        item_id: string;

        /**
         * The search phrase to find.
         */
        term?: string;

        /**
         * Page number (max. 60).
         */
        page?: number;

        /**
         * Number of items per page (max. 100).
         */
        page_size?: number;

        /**
         * How to sort results.
         */
        sort_by?: 'relevance' | 'newest' | 'oldest';
    };

    type ItemComment = {
        id: string;
        item_id: string;
        item_url: string;
        item_name: string;
        url: string;
        site: string;
        item_author_id: string;
        item_author_url: string;
        last_comment_at: string;
        conversation: ItemConversation[];
        total_converstations: string;
        buyer_and_author: string;
        highlightable: string;
    };

    type ItemConversation = {
        id: string;
        username: string;
        content: string;
        created_at: string;
        author_comment: boolean;
        hidden_by_complaint: boolean;
        complaint_state: 'no_complaint' | 'ignored' | 'ignored_with_edit' | 'pending' | 'upheld';
        profile_image_url: string;
    };

    type MarketName = 'themeforest' | 'codecanyon' | 'videohive' | 'audiojungle' | 'graphicriver' | 'photodune' | '3docean';
    type MarketDomain = 'themeforest.net' | 'codecanyon.net' | 'videohive.net' | 'audiojungle.net' | 'graphicriver.net' | 'photodune.net' | '3docean.net';

    type Sale = {
        amount: string;
        sold_at: string;
        license: string;
        support_amount: string;
        supported_until: string;
        item: Item;
    };

    type GetPurchasesOptions = {
        /**
         * Optionally filter for WordPress plugins and themes.
         */
        filter_by?: 'wordpress-themes' | 'wordpress-plugins';

        /**
         * Optional page number (default is 1).
         */
        page?: number;

        /**
         * Include more item details.
         */
        include_all_item_details?: boolean | 'true' | 'false';
    };

    type GetStatementOptions = {
        /**
         * A page number to start the results from.
         */
        page?: number;

        /**
         * The from date in `YYYY-MM-DD` format.
         */
        from_date?: string;

        /**
         * The to date in `YYYY-MM-DD` format.
         */
        to_date?: string;

        /**
         * Filter to a specific transaction type.
         */
        type?: string;

        /**
         * Filter to a particular Envato Market site.
         */
        site?: string;
    };

    type GetDownloadLinkOptions = {
        item_id?: number;
        purchase_code?: string;
        shorten_url?: boolean | 'true' | 'false';
    };

}

export = envato;
