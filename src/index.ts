// Imports
import { Client, ClientOptions, IdentityResponse } from './client';
import { OAuth, OAuthOptions, RefreshedToken } from './oauth';
import { AccessDeniedError, BadRequestError, ErrorResponse, HttpError, NotFoundError, ServerError, TooManyRequestsError, UnauthorizedError } from './helpers/errors';
import { GetCategoriesResponse, CatalogClientGroup, GetCollectionResponse, GetFeaturesResponse, GetItemPricesResponse, GetItemResponse, GetItemVersionResponse, GetNewFilesResponse, GetPopularItemsResponse, GetRandomNewFilesResponse, SearchCommentsResponse, SearchItemsResponse } from './client/catalog';
import { GetDownloadLinkResponse, GetEmailResponse, GetMonthlySalesResponse, GetPrivateAccountDetailsResponse, GetPurchaseResponse, GetPurchasesFromAppCreatorResponse, GetPurchasesResponse, GetSaleResponse, GetSalesResponse, GetStatementResponse, GetUsernameResponse, PrivateClientGroup } from './client/private';
import { GetFilesPerCategoryResponse, GetTotalItemsResponse, GetTotalUsersResponse, StatsClientGroup } from './client/stats';
import { GetAccountDetailsResponse, GetBadgesResponse, GetCollectionsResponse, GetItemsBySiteResponse, GetNewItemsResponse, GetPrivateCollectionResponse, UserClientGroup } from './client/user';

// Types
import { Attribute, Collection, Image, Item, ItemComment, ItemConversation, ItemMedium, ItemShort, SearchCommentsOptions, SearchItemsOptions } from './types/catalog';
import { MarketDomain, MarketName } from './types/market';
import { GetDownloadLinkOptions, GetPurchasesOptions, GetStatementOptions, Sale } from './types/private';

// Exports

export {
    // client
    Client, ClientOptions, IdentityResponse,

    // oauth
    OAuth, OAuthOptions, RefreshedToken,

    // helpers/errors
    AccessDeniedError, BadRequestError, ErrorResponse, HttpError, NotFoundError, ServerError, TooManyRequestsError, UnauthorizedError,

    // client/catalog
    GetCategoriesResponse, CatalogClientGroup, GetCollectionResponse, GetFeaturesResponse, GetItemPricesResponse, GetItemResponse, GetItemVersionResponse, GetNewFilesResponse, GetPopularItemsResponse, GetRandomNewFilesResponse, SearchCommentsResponse, SearchItemsResponse,

    // client/private
    GetDownloadLinkResponse, GetEmailResponse, GetMonthlySalesResponse, GetPrivateAccountDetailsResponse, GetPurchaseResponse, GetPurchasesFromAppCreatorResponse, GetPurchasesResponse, GetSaleResponse, GetSalesResponse, GetStatementResponse, GetUsernameResponse, PrivateClientGroup,

    // client/stats
    GetFilesPerCategoryResponse, GetTotalItemsResponse, GetTotalUsersResponse, StatsClientGroup,

    // client/user
    GetAccountDetailsResponse, GetBadgesResponse, GetCollectionsResponse, GetItemsBySiteResponse, GetNewItemsResponse, GetPrivateCollectionResponse, UserClientGroup,

    // types/catalog
    Attribute, Collection, Image, Item, ItemComment, ItemConversation, ItemMedium, ItemShort, SearchCommentsOptions, SearchItemsOptions,

    // types/market
    MarketDomain, MarketName,

    // types/private
    GetDownloadLinkOptions, GetPurchasesOptions, GetStatementOptions, Sale
}

// Default export
// This is for a consistent import format between TypeScript and JavaScript projects

export default {
    // client
    Client,

    // oauth
    OAuth,

    // helpers/errors
    AccessDeniedError, BadRequestError, HttpError, NotFoundError, ServerError, TooManyRequestsError, UnauthorizedError,

    // client/catalog
    CatalogClientGroup,

    // client/private
    PrivateClientGroup,

    // client/stats
    StatsClientGroup,

    // client/user
    UserClientGroup
};
