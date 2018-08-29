var Promise = require('bluebird');
var Request = require('request');
var QueryString = require('querystring');

function makeRequest(path) {
    var method = (arguments.length > 1) ? arguments[1] : 'GET';

    return function() {
        var currentPath = path;
        var args = (arguments.length > 0) ? ((typeof arguments[0] === 'object') ? arguments[0] : {}) : {};

        for (var key in args) {
            if (path.indexOf('%'+key) >= 0) {
                currentPath = currentPath.split('%'+key).join(args[key]);
                delete args[key];
            }
        }

        var query = (arguments.length) ? '?' + QueryString.stringify(args) : '';
        var uri = 'https://api.envato.com' + currentPath + ((query !== '?') ? query : '');
        var token = this.token;
        var userAgent = this.userAgent;

        return new Promise(function(resolve, reject) {
            Request({
                uri: uri,
                method: method,
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'User-Agent': userAgent
                }
            }, function (error, response, body) {
                if (error) return reject(new Error('Request Error: ' + error.message));

                if (response.statusCode === 400) return reject(new Error('Bad Request'));
                if (response.statusCode === 401) return reject(new Error('Unauthorized'));
                if (response.statusCode === 403) return reject(new Error('Access Denied'));
                if (response.statusCode === 404) return reject(new Error('Not Found'));
                if (response.statusCode === 500) return reject(new Error('Internal Server Error'));
                if (response.statusCode !== 200) return reject(new Error('Error code ' + response.statusCode + ': ' + response.statusMessage ));

                try {
                    return resolve(JSON.parse(body));
                }
                catch (error) {
                    return reject(new Error('Invalid response'));
                }
            });
        });
    };
}

function Api(token, userAgent) {
    this.token = token;
    this.userAgent = userAgent;
}

/**
 * @param token
 * @param userAgent
 * @returns {Api}
 */
function usePersonalToken(token, userAgent) {
    return new Api(token, userAgent);
}

// Catalog
Api.prototype.getCollection = makeRequest('/v3/market/catalog/collection');
Api.prototype.getItem = makeRequest('/v3/market/catalog/item');
Api.prototype.searchItems = makeRequest('/v3/discovery/search/search/item');
Api.prototype.searchComments = makeRequest('/v3/discovery/search/search/comment');
Api.prototype.getPopularItems = makeRequest('/v3/market/popular:%site.json');
Api.prototype.getCategories = makeRequest('/v3/market/categories:%site.json');
Api.prototype.getItemPrices = makeRequest('/v3/market/item-prices:%item_id.json');
Api.prototype.getNewItems = makeRequest('/v3/market/new-files:%site,%category.json');
Api.prototype.getFeaturedItems = makeRequest('/v3/market/features:%site.json');
Api.prototype.getRandomNewFiles = makeRequest('/v3/market/random-new-files:%site.json');

// User details
Api.prototype.getUserCollections = makeRequest('/v3/market/user/collections');
Api.prototype.getPrivateCollection = makeRequest('/v3/market/user/collection');
Api.prototype.getUsersDetails = makeRequest('/v3/market/user:%username.json');
Api.prototype.getUsersBadges = makeRequest('/v3/market/user-badges:%username.json');
Api.prototype.getUsersItems = makeRequest('/v3/market/user-items-by-site:%username.json');
Api.prototype.getUsersNewItems = makeRequest('/v3/market/new-files-from-user:%username,%site.json');

// Private user details
Api.prototype.getSales = makeRequest('/v3/market/author/sales');
Api.prototype.getSaleByCode = makeRequest('/v3/market/author/sale');
Api.prototype.getPurchases = makeRequest('/v3/market/buyer/list-purchases');
Api.prototype.getPurchaseByCode = makeRequest('/v3/market/buyer/purchase');
Api.prototype.getPrivateUserDetails = makeRequest('/v3/market/private/user/account.json');
Api.prototype.getUsername = makeRequest('/v3/market/private/user/username.json');
Api.prototype.getEmail = makeRequest('/v3/market/private/user/email.json');
Api.prototype.getSalesByMonth = makeRequest('/v3/market/private/user/earnings-and-sales-by-month.json');
Api.prototype.getTotalMarketUsers = makeRequest('/v3/market/total-users.json');
Api.prototype.getTotalMarketItems = makeRequest('/v3/market/total-items.json');
Api.prototype.getTotalFilesBySite = makeRequest('/v3/market/number-of-files:%site.json');

module.exports = usePersonalToken;