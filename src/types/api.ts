
// #region marketplaces

/**
 * Names of the marketplaces.
 */
export type MarketName = 'themeforest' | 'codecanyon' | 'videohive' | 'audiojungle' | 'graphicriver' | 'photodune' | '3docean';

/**
 * Domain names of the marketplaces.
 */
export type MarketDomain = 'themeforest.net' | 'codecanyon.net' | 'videohive.net' | 'audiojungle.net' | 'graphicriver.net' | 'photodune.net' | '3docean.net';

/**
 * A collection of items.
 */
export interface Collection {
    id: number;
    name: string;
    description: string;
    private: boolean;
    item_count: number;
    special_role?: string;
    image: string;
};

// #endregion

// #region items

/**
 * A short list of details about a marketplace item. For all details, you'll need to look up the item by its id.
 */
export interface ItemShort {
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

/**
 * A medium list of details about a marketplace item. For all details, you'll need to look up the item by its id.
 */
export interface ItemMedium extends ItemShort {
    uploaded_on: string;
    last_update: Date;
    tags: string;
    category: string;
    live_preview_url: string;
};

/**
 * Full details about a marketplace item.
 */
export interface Item {
    id: number;
    name: string;
    number_of_sales: number;
    author_username: string;
    author_url: string;
    url: string;
    updated_at: Date;
    attributes: ItemAttribute[];
    description: string;
    description_html: string;
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
    published_at: Date;
    trending: boolean;
    tags: string[];
    previews: {
        thumbnail_preview ?: {
            small_url: string;
            large_url: string;
            large_width: number;
            large_height: number;
        },
        icon_with_thumbnail_preview ?: {
            icon_url: string;
            thumbnail_url: string;
            thumbnail_width: number;
            thumbnail_height: number;
        },
        icon_with_landscape_preview ?: {
            icon_url: string;
            landscape_url: string;
        },
        icon_with_square_preview ?: {
            icon_url: string;
            square_url: string;
            image_urls: ItemImage[];
        },
        icon_with_audio_preview ?: {
            icon_url: string;
            mp3_url: string;
            mp3_preview_waveform_url: string | null;
            mp3_preview_download_url: string | null;
            mp3_id: string;
            length: {
                hours: number;
                minutes: number;
                seconds: number;
            };
        },
        icon_with_video_preview ?: {
            icon_url: string;
            landscape_url: string;
            video_url: string;
            type: string;
        },
        live_site ?: {
            url: string;
        },
        icon_preview ?: {
            icon_url: string;
            type: string;
        },
        landscape_preview ?: {
            landscape_url: string;
            image_urls ?: ItemImage[];
        }
    }
};

/**
 * An image resource used in items.
 */
export interface ItemImage {
    name: string | null;
    url: string;
    width: number;
    height: number;
};

/**
 * An attribute for an item.
 */
export interface ItemAttribute {
    name: string;
    value: string | string[] | null;
    label?: string;
};

/**
 * An individual comment in a conversation.
 */
export interface ItemComment {
    id: string;
    username: string;
    content: string;
    created_at: Date;
    author_comment: boolean;
    hidden_by_complaint: boolean;
    complaint_state: 'no_complaint' | 'ignored' | 'ignored_with_edit' | 'pending' | 'upheld';
    profile_image_url: string | null;
};

/**
 * A conversation between an author and a buyer on an item's comments section.
 */
export interface ItemConversation {
    id: number;
    item_id: number;
    item_url: string;
    item_name: string;
    url: string;
    site: MarketDomain;
    item_author_id: number;
    item_author_url: string;
    last_comment_at: Date;
    conversation: ItemComment[];
    total_converstations: number;
    buyer_and_author: boolean;
    highlightable: string[];
}

// #endregion

// #region buyer

// #endregion

// #region author

/**
 * A sale made by an author.
 */
export interface Sale {
    amount: string;
    sold_at: Date;
    license: string;
    support_amount: string;
    supported_until: Date;
    item: Item;
};

// #endregion
