// Imports

import { Client, ClientOptions, IdentityResponse } from './client';
import { OAuth, OAuthOptions, IRefreshedToken } from './oauth';
import { AccessDeniedError, BadRequestError, ErrorResponse, HttpError, NotFoundError, ServerError, TooManyRequestsError, UnauthorizedError } from './helpers/errors';
import { ICategoriesResponse, CatalogEndpoints, ICollectionResponse, IFeaturesResponse, IItemPricesResponse, IItemVersionResponse, IPopularItemsResponse, ISearchCommentsResponse, ISearchItemsResponse } from './endpoints/catalog';
import { IDownloadLinkResponse, IEmailResponse, IMonthlySalesResponse, IPrivateAccountDetailsResponse, IPurchaseResponse, IPurchasesFromAppCreatorResponse, IPurchasesResponse, ISaleResponse, IStatementResponse, IUsernameResponse, PrivateEndpoints } from './endpoints/private';
import { IFilesPerCategoryResponse, StatsEndpoints } from './endpoints/stats';
import { IAccountDetailsResponse, IBadgesResponse, IItemsBySiteResponse, IPrivateCollectionResponse, UserEndpoints } from './endpoints/user';

// Types

import { MarketDomain, MarketName, Collection, Item, ItemAttribute, ItemComment, ItemConversation, ItemImage, ItemMedium, ItemShort, Sale } from './types/api';
import { CommentSearchOptions, DownloadLinkOptions, ItemSearchOptions, ListPurchasesOptions, StatementOptions } from './types/options';

// Exports

export {
    // client
    Client, ClientOptions, IdentityResponse,

    // oauth
    OAuth, OAuthOptions, IRefreshedToken,

    // helpers/errors
    AccessDeniedError, BadRequestError, ErrorResponse, HttpError, NotFoundError, ServerError, TooManyRequestsError, UnauthorizedError,

    // client/catalog
    ICategoriesResponse, CatalogEndpoints, ICollectionResponse, IFeaturesResponse, IItemPricesResponse, IItemVersionResponse, IPopularItemsResponse, ISearchCommentsResponse, ISearchItemsResponse,

    // client/private
    IDownloadLinkResponse, IEmailResponse, IMonthlySalesResponse, IPrivateAccountDetailsResponse, IPurchaseResponse, IPurchasesFromAppCreatorResponse, IPurchasesResponse, ISaleResponse, IStatementResponse, IUsernameResponse, PrivateEndpoints,

    // client/stats
    IFilesPerCategoryResponse, StatsEndpoints,

    // client/user
    IAccountDetailsResponse, IBadgesResponse, IItemsBySiteResponse, IPrivateCollectionResponse, UserEndpoints,

    // types/api
    MarketDomain, MarketName, Collection, Item, ItemAttribute, ItemComment, ItemConversation, ItemImage, ItemMedium, ItemShort, Sale,

    // types/options
    CommentSearchOptions, DownloadLinkOptions, ItemSearchOptions, ListPurchasesOptions, StatementOptions
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
    CatalogEndpoints,

    // client/private
    PrivateEndpoints,

    // client/stats
    StatsEndpoints,

    // client/user
    UserEndpoints
};
