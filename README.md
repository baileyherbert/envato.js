[![Envato.js](https://i.bailey.sh/pAEYtWD.png)](https://github.com/baileyherbert/envato.js)

<p align="center">
  <a aria-label="Build" href="https://travis-ci.org/baileyherbert/envato.js">
    <img alt="" src="https://img.shields.io/travis/baileyherbert/envato.js?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/envato">
    <img alt="" src="https://img.shields.io/npm/v/envato.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="License" href="https://github.com/baileyherbert/envato.js/blob/master/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/envato.svg?style=for-the-badge&labelColor=000000">
  </a>
</p>

---

This is a wrapper for the new Envato API. It parses responses and conveniently returns the exact data you're looking for. It also offers:

- Supports both OAuth and personal tokens.
- Automatic renewal of OAuth access tokens.
- Simple error handling.
- Full type hinting and autocompletion.

It also works in modern browsers. If you need to support older browsers, consider using a bundler such as Webpack with Babel.

---

- [Basic usage](#basic-usage)
- [Creating a client](#creating-a-client)
  - [Personal token](#personal-token)
  - [OAuth](#oauth)
  - [Client options](#client-options)
    - [User agent](#user-agent)
    - [Request options](#request-options)
- [Sending requests](#sending-requests)
  - [Using promises](#using-promises)
  - [Getting a user's identity](#getting-a-users-identity)
  - [Manually sending requests](#manually-sending-requests)
  - [Catalog](#catalog)
    - [Look up a public collection](#look-up-a-public-collection)
    - [Look up a single item](#look-up-a-single-item)
    - [Look up a WordPress theme or plugin's version](#look-up-a-wordpress-theme-or-plugins-version)
    - [Search for items](#search-for-items)
    - [Search for comments](#search-for-comments)
    - [Get popular items by site](#get-popular-items-by-site)
    - [Get categories by site](#get-categories-by-site)
    - [Get prices for an item](#get-prices-for-an-item)
    - [Get new items by site and category](#get-new-items-by-site-and-category)
    - [Find featured items and authors](#find-featured-items-and-authors)
    - [Get random new items](#get-random-new-items)
  - [User](#user)
    - [List a user's collections](#list-a-users-collections)
    - [Look up a user's private collection](#look-up-a-users-private-collection)
    - [Get a user's profile details](#get-a-users-profile-details)
    - [List a user's badges](#list-a-users-badges)
    - [Get a user's item count per marketplace](#get-a-users-item-count-per-marketplace)
    - [Get a user's newest items](#get-a-users-newest-items)
  - [Private user](#private-user)
    - [List an author's sales](#list-an-authors-sales)
    - [Look up a sale by code](#look-up-a-sale-by-code)
    - [List all purchases](#list-all-purchases)
    - [List a buyer's purchases](#list-a-buyers-purchases)
    - [Look up a purchase by code](#look-up-a-purchase-by-code)
    - [Get a user's account details](#get-a-users-account-details)
    - [Get a user's username](#get-a-users-username)
    - [Get a user's email](#get-a-users-email)
    - [Get an author's monthly sales](#get-an-authors-monthly-sales)
    - [Get statement data](#get-statement-data)
    - [Download a purchase](#download-a-purchase)
  - [Statistics](#statistics)
    - [Get the total number of market users](#get-the-total-number-of-market-users)
    - [Get the total number of market items](#get-the-total-number-of-market-items)
    - [Get the number of items per category](#get-the-number-of-items-per-category)
- [Error handling](#error-handling)
  - [Error codes](#error-codes)
  - [Not found errors](#not-found-errors)
- [Events](#events)
  - [Renew](#renew)
  - [Debug](#debug)

---

## Basic usage

To get started, install [the package](https://npmjs.com/package/envato) into your project and require it like normal. Then you can begin using the exported `Client` and `OAuth` classes immediately.

```
npm install envato
```

```js
const Envato = require('envato');

(async function() {
    let client = new Envato.Client({
        token: 'personal token here'
    });

    let { userId } = await client.getIdentity();
    let username = await client.private.getUsername();
    let email = await client.private.getEmail();

    console.log('Logged in:', userId, username, email);
})();
```

## Creating a client

Before you can send requests, you must create a client instance with your personal token or an OAuth access token.

### Personal token

You can create a client from a personal token by passing the `token` parameter into the client options.

```js
const client = new Envato.Client({
    token: 'your personal token'
});
```

### OAuth

The first step to working with OAuth is creating the OAuth helper instance. Supply the client ID, client secret, and redirect URI exactly as they were configured via [build.envato.com](https://build.envato.com):

```js
const oauth = new Envato.OAuth({
    client_id: '',
    client_secret: '',
    redirect_uri: ''
});
```

Next, redirect the user to the authentication screen using the `getRedirectUrl` method:

```js
res.redirect(oauth.getRedirectUrl());
```

Once the user returns from a successful authentication, the current URL should contain a `code` query parameter with an authentication code. Pass this code to `getClient` to finish the authentication process.

```js
app.get('/authenticate', async function(req, res) {
    let code = req.query.code;

    try {
    	let client = await oauth.getClient(code);
        let username = await client.private.getUsername();

        res.send(`Hello, ${username}!`);
    }
    catch (error) {
        console.error('Authentication failed:', error);
        res.status(500).send('Something broke!');
    }
});
```

Once you have your `client` instance, you can extract the access and refresh tokens, as well as the expiration time, and store them in a database for future use.

```js
let { token, refreshToken, expiration } = client;

console.log('The current access token is %s', token);
console.log('It expires at %d', expiration);
```

In the future, if you need to reconstruct a client instance from these parameters, you must pass all three (as well as the OAuth helper instance) to enable automatic renewal of the access token.

```js
let client = new Envato.Client({
    token: database.load('token'),
    refreshToken: database.load('refreshToken'),
    expiration: database.load('expiration'),
    oauth: new Envato.OAuth() // or use an existing instance
});
```

Additionally, you will likely want to keep track of the new access token and expiration times whenever the client regenerates it. To do this, listen to the `renew` event on the client instance.

```js
client.on('renew', renewal => {
   	console.log('Got a new access token:', renewal.access_token);
   	console.log('The new token expires at:', renewal.expiration);
});
```

### Client options

#### User agent

For high-volume users, it is highly recommended that you provide a user agent with your requests. This agent should briefly describe how you're using the API and why you need it, and will help the Envato team understand your needs.

You can specify a user agent when instantiating your client via the `userAgent` option. Here's a great example:

```js
new Envato.Client({
    token: 'personal token',
    userAgent: 'License activation & forums for Avada at themefusion.com'
})
```

#### Request options

This library uses `request` under the hood for its HTTP requests. If you need to specify HTTP options, you can use the `request` option in the client. Check out the [request docs](https://www.npmjs.com/package/request#requestoptions-callback) for a list of available options.

```js
new Envato.Client({
    token: 'personal token',
    request: {
        gzip: false,
        timeout: 10000,
        strictSSL: false
    }
})
```

## Sending requests

There are four endpoint helpers for sending requests. Each is a class accessible as a property of the client:

- Catalog – `client.catalog`
- User – `client.user`
- Private user – `client.private`
- Statistics – `client.stats`

When sending a request, you will receive a `Promise` instance in return. I recommend using the `await` syntax, but you can also do it the old fashioned way as shown below.

Note that the return values from this wrapper won't always perfectly match the responses from the API. This wrapper tries to provide consistent types, so check the code samples below or refer to your editor's type hinting to determine return types.

### Using promises

The code samples in this documentation use the `await` operator for simplicity and convenience. If you need to use promises the old fashioned way, then it will look like this:

```js
client.private.getUsername().then(function(username) {
    console.log(`Hello, ${username}!`);
}).catch(function(error) {
    console.error('Failed to get username:', error.message, error.response);
});
```

### Getting a user's identity

You may wish to retrieve a unique ID for the user's account under which you can store data in your own database. Or, you may need to check the permissions on a personal token. You can check both of these through the `getIdentity` method.

```js
let { userId, scopes } = await client.getIdentity();

console.log('Id:', userId);
console.log('Scopes:', scopes);
```

```js
Id: 122459
Scopes: [
    'default',
    'user:username',
    'user:email',
    'sale:verify'
]
```

### Manually sending requests

The client exposes several different methods for sending requests (one for each of get, post, put, patch, and delete).

In the example below, we send a `POST` request to `/v3/path/to/endpoint` with the `params` object as our encoded form body. The return value is a parsed object.

```js
let params = { name: 'hello world', id: 24596 };
let response = await client.post('/v3/path/to/endpoint', params);
```

For TypeScript users, it is possible to use generics to specify the format of the return value:

```ts
type Response = {
    id: number;
    name: string;
    private: boolean;
};

let response = await client.get<Response>('/v3/endpoint');
let id = response.id; // hinted as a number
let private = response.private; // hinted as a boolean
```

### Catalog

#### Look up a public collection

Returns details of, and items contained within, a public collection.

```js
let response = await client.catalog.getCollection(25043);

let name = response.collection.name;
let items = response.items;
```

#### Look up a single item

Returns all details of a particular item on Envato Market.

```js
let item = await client.catalog.getItem(123456);

let itemId = item.id;
let itemName = item.name;
let itemAuthor = item.author_username;
```

#### Look up a WordPress theme or plugin's version

Returns the latest available version of a theme/plugin. This is the recommended endpoint for WordPress theme/plugin authors building an auto-upgrade system into their item that needs to check if a new version is available.

```js
let version = await client.catalog.getItemVersion(123456);

let themeVersion = version.wordpress_theme_latest_version;
let pluginVersion = version.wordpress_plugin_latest_version;
```

#### Search for items

Searches the marketplaces for items, with the same engine as the search on the market sites. Pass an object containing parameters as seen on the [API docs](https://build.envato.com/api#search_GET_search_item_json).

```js
let response = await client.catalog.searchItems({
    term: 'seo',
    site: 'codecanyon.net',
    page_size: 100,
    page: 3
});

console.log('Search took %d milliseconds', response.took);
console.log('Found %d items', response.matches.length);

for (let item of response.matches) {
    console.log('Item %d: %s', item.id, item.name);
}
```

#### Search for comments

Searches for comments on a specific item.

```js
let response = await client.catalog.searchComments({
    item_id: 123456,
    sort_by: 'newest',
    page_size: 100,
    page: 1
});

console.log('Search took %d milliseconds', response.took);
console.log('Found %d comments', response.matches.length);
```

#### Get popular items by site

Returns the popular files for a particular site.

```js
let popular = await client.catalog.getPopularItems();

let lastWeek = popular.items_last_week;
let lastThreeMonths = popular.items_last_three_months;
let authorsLastMonth = popular.authors_last_month;
```

#### Get categories by site

Lists the categories of a particular site.

```js
let categories = await client.catalog.getCategories('codecanyon');

for (let category of categories) {
    console.log('%s (%s)', category.name, category.path);
}
```

#### Get prices for an item

Return available licenses and prices for the given item ID.

```js
let prices = await client.catalog.getItemPrices(123456);

for (let entry of prices) {
    console.log('%s ($%s)', entry.license, entry.price);
}
```

```
Regular License ($12.00)
Extended License ($125.00)
```

#### Get new items by site and category

New files, recently uploaded to a particular site.

```js
let items = await client.catalog.getNewFiles('codecanyon', 'php-scripts');

for (let item of items) {
    console.log(item.id, item.name);
}
```

#### Find featured items and authors

Shows the current site features.

```js
let features = await client.catalog.getFeatures('codecanyon');

let featuredMonthlyFile = features.featured_file;
let featuredAuthor = features.featured_author;
let freeMonthlyFile = features.free_file;
```

#### Get random new items

Shows a random list of newly uploaded files from a particular site (i.e. like the homepage). This doesn't actually appear to be random at this time, but rather sorted by newest first. Could change in future since the endpoint is officially documented to return random results.

```js
let items = await client.catalog.getRandomNewFiles('codecanyon');

for (let item of items) {
    console.log(item.id, item.name);
}
```

### User

#### List a user's collections

Lists all of the user's private and public collections.

```js
let collections = await client.user.getCollections();

for (let collection of collections) {
    console.log(collection.id, collection.name);
}
```

#### Look up a user's private collection

Returns details and items for public or the user's private collections.

```js
let { collection, items } = await client.user.getPrivateCollection(123456);

console.log('Collection:', collection.id, collection.name);

for (let item of items) {
    console.log('Item:', item.id, item.name);
}
```

#### Get a user's profile details

Shows username, country, number of sales, number of followers, location and image for a user.

```js
let user = await client.user.getAccountDetails('baileyherbert');

console.log('Username:', user.username);
console.log('Sales:', user.sales);
console.log('Avatar URL:', user.image);
```

#### List a user's badges

Shows a list of badges for the given user.

```js
let badges = await client.user.getBadges('baileyherbert');

for (let badge of badges) {
    console.log('Badge:', badge.name, badge.label, badge.image);
}
```

#### Get a user's item count per marketplace

Show the number of items an author has for sale on each site.

```js
let counts = await client.user.getItemsBySite('baileyherbert');

for (let count of counts) {
    console.log('The user has %d items on %s', count.items, count.site);
}
```

#### Get a user's newest items

Shows up to 1000 newest files uploaded by a user to a particular site.

```js
let items = await client.user.getNewItems('baileyherbert', 'codecanyon');

for (let item of items) {
    console.log(item.id, item.name);
}
```

### Private user

#### List an author's sales

Lists all unrefunded sales of the authenticated user's items listed on Envato Market. Author sales data ("Amount") is reported before subtraction of any income taxes (eg US Royalty Withholding Tax).

```js
let sales = await client.private.getSales();

for (let sale of sales) {
    console.log('Sold %s for $%s', sale.item.name, sale.amount);
}
```

#### Look up a sale by code

Returns the details of an author's sale identified by the purchase code. Author sales data ("Amount") is reported before subtraction of any income taxes (eg US Royalty Withholding Tax).

```js
let sale = await client.private.getSale('purchase-code');

console.log('Buyer:', sale.buyer);
console.log('Item:', sale.item.id, sale.item.name);
```

#### List all purchases

List purchases that the user has made on their account.

```js
let purchases = await client.private.getPurchases();
```

#### List a buyer's purchases

Lists all purchases that the authenticated user has made of the app creator's listed items. Only works with OAuth tokens.

```js
let { purchases } = await client.private.getPurchasesFromAppCreator();

for (let purchase of purchases) {
    console.log('Bought %s (purchase code: %s)', purchase.item.name, purchase.code);
}
```

#### Look up a purchase by code

Returns the details of a user's purchase identified by the purchase code.

```js
let purchase = await client.private.getPurchase('purchase-code');
```

#### Get a user's account details

Returns the first name, surname, earnings available to withdraw, total deposits, balance (deposits + earnings) and country.

```js
let account = await client.private.getAccountDetails();
```

#### Get a user's username

Returns the currently logged in user's Envato Account username as a string.

```js
let username = await client.private.getUsername();
```

#### Get a user's email

Returns the currently logged in user's email address as a string.

```js
let email = await client.private.getEmail();
```

#### Get an author's monthly sales

Returns the monthly sales data, as displayed on the user's earnings page. Monthly sales data ("Earnings") is reported before subtraction of any income taxes (eg US Royalty Withholding Tax).

```js
let sales = await client.private.getMonthlySales();
```

#### Get statement data

Lists transactions from the user's statement page.

```js
let response = await client.private.getStatement();
```

#### Download a purchase

Download purchased items by either the item_id or the purchase_code. Each invocation of this endpoint will count against the items daily download limit. Returns a string containing the one-time download link.

```js
let url = await client.private.getDownloadLink({
    item_id: 123456
});
```

### Statistics

#### Get the total number of market users

Returns the total number of subscribed users to Envato Market.

```js
let users = await client.stats.getTotalUsers();
```

#### Get the total number of market items

Returns the total number of items available on Envato Market.

```js
let items = await client.stats.getTotalItems();
```

#### Get the number of items per category

Returns the total number of items available on Envato Market.

```js
let categories = await client.stats.getFilesPerCategory();
```

## Error handling

When sending a request, you should always be prepared to handle errors in the case of an invalid token or server outage. If you're using the `await` operator, then you should surround your calls in a try/catch block:

```js
try {
    let email = await client.private.getEmail();
}
catch (error) {
    if (error instanceof Envato.HttpError) {
        console.error('Status:', error.code);
        console.error('Message:', error.message);
        console.error('More details:', error.response);
    }
    else {
        console.error('Got an error from request.');
    }
}
```

As shown in the code above, requests can throw two different categories of errors. The first is an instance of `Envato.HttpError`, which will contain a message such as "Unauthorized" or "Not Found". It will also provide a `response` object which will look something like this:

```json
{
  "error": 404,
  "description": "No sale belonging to the current user found with that code"
}
```

The second type of error is a generic `Error` instance which is most likely to originate from the underlying `request` library and will ultimately be caused by a connection error, parsing error, or timeout.

### Error codes

| Code | Object                        | Meaning                                                        |
|------|-------------------------------|----------------------------------------------------------------|
| 400  | `Envato.BadRequestError`      | A parameter or argument in the request was invalid or missing. |
| 401  | `Envato.UnauthorizedError`    | The token is invalid or expired.                               |
| 403  | `Envato.AccessDeniedError`    | The token does not have the required permissions.              |
| 404  | `Envato.NotFoundError`        | The requested resource was not found.                          |
| 429  | `Envato.TooManyRequestsError` | You're sending too many requests, slow down.                   |
| 500  | `Envato.ServerError`          | API is down or under maintenance, try again later.             |

### Not found errors

The `Envato.NotFoundError` is a special case, because it represents a missing resource rather than a failed request. For instance, if you are looking up a sale by purchase code and the code is invalid, it will throw this error.

## Events

The client exposes two events that you can listen to using the `on()` method.

### Renew

This event is triggered whenever the client generates a new access token due to the previous token becoming expired. This only applies to clients using OAuth.

```js
client.on('renew', function(data) {
    let accessToken = data.access_token;
    let expiration = data.expiration;
});
```

### Debug

This event is triggered once for each request, and is sent the raw arguments from the underlying `request` library. You can use this to debug problems and see what's going on under the hood, and for logging purposes.

```js
client.on('debug', function(err, response, body) {
   	console.log('Debug:', err, response, body);
});
```
