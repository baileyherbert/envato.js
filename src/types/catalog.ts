import { MarketDomain } from './market';

export type Collection = {
    id: number;
    name: string;
    description: string;
    private: boolean;
    item_count: number;
    special_role?: string;
    image: string;
};

export type Item = {
    id: number;
    name: string;
    number_of_sales: number;
    author_username: string;
    author_url: string;
    url: string;
    updated_at: string;
    attributes: Attribute[];
    description: string;
    site: MarketDomain,
    classification: string;
    classification_url: string;
    price_cents: number;
    author_image: string;
    summary: string;
    wordpress_theme_metadata ?: {
        theme_name: string;
        author_name: string;
        version: string;
        description: string;
    }
    rating: number;
    rating_count: number;
    published_at: string;
    trending: boolean;
    tags: string[];
    previews: {
        icon_preview ?: {
            icon_url: string;
            type: string;
        },
        icon_with_video_preview ?: {
            icon_url: string;
            landscape_url: string;
            video_url: string;
            type: string;
        }
    }
};

export type ItemShort = {
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

export type ItemMedium = ItemShort & {
    uploaded_on: string;
    last_update: string;
    tags: string;
    category: string;
    live_preview_url: string;
};

export type Attribute = {
    name: string;
    value: string | string[];
    label: string;
};

export type SearchItemsOptions = {
    /**
     * The string to search for.
     */
    term ?: string;

    /**
     * The site to match.
     */
    site ?: MarketDomain,

    /**
     * Comma separated list of tags to match.
     */
    tags ?: string;

    /**
     * Category code to search for.
     */
    category ?: string;

    /**
     * The platform to match.
     */
    platform ?: string;

    /**
     * Frameworks or compatible software to match.
     */
    compatible_with ?: string;

    /**
     * Comma separated list of colors to match.
     */
    colors ?: string;

    /**
     * Comma separated list of sizes to match.
     */
    sizes ?: string;

    /**
     * A minimum photo size to match.
     */
    size ?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

    /**
     * Name of the sales bucket to filter by (see the aggregation sales result).
     */
    sales ?: string;

    /**
     * Minimum rating to filter by.
     */
    rating_min ?: number;

    /**
     * Minimum price to include, in whole dollars.
     */
    price_min ?: number;

    /**
     * Maximum price to include, in whole dollars.
     */
    price_max ?: number;

    /**
     * Prefered polygon count. Either a single polygon count or a range seperated by `-`.
     */
    poly_count ?: string;

    /**
     * The item type to match.
     */
    item_type ?: string;

    /**
     * Whether to include search suggestions.
     */
    suggest ?: boolean | 'true' | 'false';

    /**
     * Restrict items by original uploaded date.
     */
    date ?: 'this-year' | 'this-month' | 'this-week' | 'this-day';

    /**
     * Restrict items by updated date.
     */
    date_updated ?: 'this-year' | 'this-month' | 'this-week' | 'this-day';

    /**
     * Minimum video or audio length in the form, in seconds.
     */
    length_min ?: number;

    /**
     * Maximum video or audio length in the form, in seconds.
     */
    length_max ?: number;

    /**
     * One of very-slow, slow, medium, upbeat, fast and very-fast.
     */
    tempo ?: 'very-slow' | 'slow' | 'medium' | 'upbeat' | 'fast' | 'very-fast';

    /**
     * Does the graphic include an alpha mask?
     */
    alpha ?: boolean | 'true' | 'false';

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
    vocals_in_audio ?: string;

    /**
     * Does the item loop seamlessly?
     */
    looped ?: boolean | 'true' | 'false';

    /**
     * Image or video orientation to match.
     */
    orientation ?: 'landscape' | 'portrait' | 'square';

    /**
     * Restrict to items that do or don't require plugins.
     */
    requires_plugins ?: 'T' | 'F';

    /**
     * The minimum resolution for video content.
     */
    resolution_min ?: '720p' | '1080p' | '2K' | '4K';

    /**
     * Match a particular FPS value for video content.
     */
    frame_rate ?: string;

    /**
     * Page number (max. 60).
     */
    page ?: number;

    /**
     * Number of items per page (max. 100).
     */
    page_size ?: number;

    /**
     * The name of the attribute to search by, eg: `'compatible-with'`.
     */
    attribute_key ?: string;

    /**
     * The attribute value to match, eg: `'Wordpress 3.5'`.
     */
    attribute_value ?: string | number;

    /**
     * Username to restrict by.
     */
    username ?: string;

    /**
     * How to sort the results.
     */
    sort_by ?: 'relevance' | 'rating' | 'sales' | 'price' | 'date' | 'updated' | 'category' | 'name' | 'trending' | 'featured_until';

    /**
     * Sort direction.
     */
    sort_direction ?: 'asc' | 'desc';
};

export type SearchCommentsOptions = {
    /**
     * The item id to search for comments on.
     */
    item_id: string;

    /**
     * The search phrase to find.
     */
    term ?: string;

    /**
     * Page number (max. 60).
     */
    page ?: number;

    /**
     * Number of items per page (max. 100).
     */
    page_size ?: number;

    /**
     * How to sort results.
     */
    sort_by ?: 'relevance' | 'newest' | 'oldest';
};

export type ItemComment = {
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

export type ItemConversation = {
    id: string;
    username: string;
    content: string;
    created_at: string;
    author_comment: boolean;
    hidden_by_complaint: boolean;
    complaint_state: 'no_complaint' | 'ignored' | 'ignored_with_edit' | 'pending' | 'upheld';
    profile_image_url: string;
};
