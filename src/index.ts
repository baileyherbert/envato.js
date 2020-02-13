/*
    Named exports
*/

export * from './client';
export * from './oauth';

export {
    GetCategoriesResponse,
    GetCollectionResponse,
    GetFeaturesResponse,
    GetItemPricesResponse,
    GetItemResponse,
    GetItemVersionResponse,
    GetNewFilesResponse,
    GetPopularItemsResponse,
    GetRandomNewFilesResponse,
    SearchCommentsResponse,
    SearchItemsResponse
} from './client/catalog';

export {
    GetDownloadLinkResponse,
    GetEmailResponse,
    GetMonthlySalesResponse,
    GetPrivateAccountDetailsResponse,
    GetPurchaseResponse,
    GetPurchasesFromAppCreatorResponse,
    GetPurchasesResponse,
    GetSaleResponse,
    GetSalesResponse,
    GetStatementResponse,
    GetUsernameResponse
} from './client/private';

export {
    GetFilesPerCategoryResponse,
    GetTotalItemsResponse,
    GetTotalUsersResponse
} from './client/stats';

export {
    GetAccountDetailsResponse,
    GetBadgesResponse,
    GetCollectionsResponse,
    GetItemsBySiteResponse,
    GetNewItemsResponse,
    GetPrivateCollectionResponse
} from './client/user';

export * from './types/catalog';
export * from './types/market';
export * from './types/private';

export * from './helpers/errors';

/*
    Default export for easier importing in TypeScript projects
*/

module.exports.default = module.exports;
