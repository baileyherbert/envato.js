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

This is a library for working with the new Envato API.

- Methods available for all endpoints at [build.envato.com](https://build.envato.com/).
- Supports both OAuth and personal tokens.
- Handles rate limits and concurrency for you.
- Full type hinting and autocompletion in modern editors.

Envato.js extracts the relevant data from responses and returns them without any extra bloat. It also converts data
where possible, such as converting timestamps into `Date` objects.

---

- [Basic usage](#basic-usage)
- [Creating a client](#creating-a-client)
  - [Personal token](#personal-token)
  - [OAuth](#oauth)
  - [Client options](#client-options)
    - [User agent](#user-agent)
    - [Request options](#request-options)
    - [Rate limiting](#rate-limiting)
    - [Concurrency](#concurrency)
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
  - [Ratelimit](#ratelimit)
  - [Resume](#resume)

---

## Basic usage

To get started, install [the package](https://npmjs.com/package/envato) into your project and require it. Then you can begin using the exported `Client` and `OAuth` classes.

```
npm install envato
```

```js
const Envato = require('envato');

async function start() {
    const client = new Envato.Client('personal token here');

    const { userId } = await client.getIdentity();
    const username = await client.private.getUsername();
    const email = await client.private.getEmail();

    console.log('Logged in:', userId, username, email);
}

start().catch(console.error);
```

## Creating a client

Before you can send requests, you must create a client instance with your personal token or an OAuth access token.

### Personal token

You can create a client from a personal token by passing the `token` parameter into the client options. You can generate a new token at https://build.envato.com/create-token.

```js
const client = new Envato.Client('your personal token');
const client = new Envato.Client({
    token: 'your personal token'
});
```

### OAuth

The first step to working with OAuth is creating the OAuth helper instance. Supply the client ID, client secret, and redirect URI exactly as they were configured via [build.envato.com](https://build.envato.com/register):

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
// This is an example express route to handle the request
app.get('/authenticate', async function(req, res) {
    try {
        // Fetch the code from the URL
        const code = req.query.code;

        // Authenticate the user via the API
    	const client = await oauth.getClient(code);
        const username = await client.private.getUsername();

        // You can also get their User ID for data storage
        const { userId } = await client.getIdentity();

        res.send(`Hello, ${username}!`);
    }
    catch (error) {
        console.error('Authentication failed:', error);
        res.status(500).send('Something broke! Try again.');
    }
});
```

Once you have your `client` instance, you can extract the access and refresh tokens, as well as the expiration time, and store them in a database for future use.

```js
const { token, refreshToken, expiration } = client;

console.log('The current access token is %s', token);
console.log('It expires at %d', expiration);
```

In the future, if you need to reconstruct a client instance from these parameters, you must pass all three (as well as the OAuth helper instance) to enable automatic renewal of the access token.

```js
// For automatic renewal of access tokens, you'll need an OAuth instance
// It must have the same credentials as the instance that originally authenticated the user
const oauth = new Envato.OAuth(...);

// To construct a client with automatic renewal, pass all properties and an OAuth instance
// Once the token expires, it will be automatically renewed
const client = new Envato.Client({
    token: fakeStorage.get('accessToken'),
    refreshToken: fakeStorage.get('refreshToken'),
    expiration: fakeStorage.get('expiration'),
    oauth
});

// To construct a client WITHOUT automatic renewal, simply pass the token
// Once the token expires, the client will stop working
const client = new Envato.Client(fakeStorage.get('token'));
```

Additionally, you will likely want to keep track of the new access token and expiration times whenever the client regenerates it. To do this, listen to the `renew` event on the client instance.

```js
client.on('renew', renewal => {
    fakeStorage.set('accessToken', renewal.accessToken);
    fakeStorage.set('expiration', renewal.expiration);
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

This library uses [`node-fetch`](https://www.npmjs.com/package/node-fetch) under the hood for its HTTP requests. You can use the `http` option to customize the default timeout and compression settings.

```js
new Envato.Client({
    token: 'personal token',
    http: {
        timeout: 30000,
        compression: false
    }
})
```

#### Rate limiting

The `handleRateLimits` option controls how the client responds to rate limiting. If set to `true` (default), the client will silently handle rate limit errors by pausing subsequent requests until the rate limit expires, as well as retrying the failed request automatically. This process is entirely behind-the-scenes and requires no extra implementation from you.

Setting this option to `false` will disable silent rate limit handling, and instead will throw `Envato.TooManyRequests` errors when rate limits are encountered. You will need to manually throttle your requests.

#### Concurrency

The `concurrency` option controls how many active requests the client can have at a single time. The default value is `3`, which means if you send four requests at the same time, only the first three will execute initially, and the fourth will be deferred until one of the first three completes.

Setting this option to `0` will disable throttling, meaning requests will always be executed immediately, and `handleRateLimits` will be forcefully disabled for safety reasons.

## Sending requests

There are four endpoint helpers for sending requests. Each is a class accessible as a property of the client:

- Catalog – `client.catalog`
- User – `client.user`
- Private user – `client.private`
- Statistics – `client.stats`

When sending a request, you will receive a `Promise` instance in return. I recommend using the `await` syntax, but you can also do it the old fashioned way as shown in the section below.

Note that the return values from this wrapper won't always perfectly match the responses from the API. This wrapper tries to provide consistent types, so check the code samples below or refer to your editor's type hinting to determine return types.

### Using promises

The code samples in this documentation use the `await` operator for simplicity and convenience. However, you can still use promises the old-fashioned way if you'd like. The code snippet below shows both methods.

```js
// With await operator (recommended)
try {
    const username = await client.private.getUsername();
    console.log(`Hello, ${username}!`);
}
catch (error) {
    console.error('Failed to get username:', error.message, error.response);
}

// With classic promises
client.private.getUsername().then(function(username) {
    console.log(`Hello, ${username}!`);
}).catch(function(error) {
    console.error('Failed to get username:', error.message, error.response);
});
```

### Getting a user's identity

You may wish to retrieve a unique ID for the user's account under which you can store data in your own database. Or, you may need to check the permissions on a personal token. You can check both of these through the `getIdentity` method.

```js
const { userId, scopes } = await client.getIdentity();

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
const params = { name: 'hello world', id: 24596 };
const response = await client.post('/v3/path/to/endpoint', params);
```

For TypeScript users, it is possible to use generics to specify the format of the return value:

```ts
interface Response {
    id: number;
    name: string;
    private: boolean;
};

const response = await client.get<Response>('/v3/endpoint');
const id = response.id; // Hinted as a number
const private = response.private; // Hinted as a boolean
```

### Catalog

#### Look up a public collection

Returns details of, and items contained within, a public collection. Returns `undefined` if the collection is not found.

```js
const response = await client.catalog.getCollection(25043);

const name = response.collection.name;
const items = response.items;
```

#### Look up a single item

Returns all details of a particular item on Envato Market. Returns `undefined` if the item is not found.

```js
const item = await client.catalog.getItem(123456);

const itemId = item.id;
const itemName = item.name;
const itemAuthor = item.author_username;
```

#### Look up a WordPress theme or plugin's version

Returns the latest available version of a theme/plugin. This is the recommended endpoint for WordPress theme/plugin authors building an auto-upgrade system into their item that needs to check if a new version is available. Returns `undefined` if the theme or plugin is not found.

```js
const version = await client.catalog.getItemVersion(123456);

const themeVersion = version.wordpress_theme_latest_version;
const pluginVersion = version.wordpress_plugin_latest_version;
```

#### Search for items

Searches the marketplaces for items, with the same engine as the search on the market sites. Pass an object containing parameters as seen on the [API docs](https://build.envato.com/api#search_GET_search_item_json).

```js
const response = await client.catalog.searchItems({
    term: 'seo',
    site: 'codecanyon.net',
    page_size: 100,
    page: 3
});

console.log('Search took %d milliseconds', response.took);
console.log('Found %d items', response.matches.length);

for (const item of response.matches) {
    console.log('Item %d: %s', item.id, item.name);
}
```

#### Search for comments

Searches for comments on a specific item.

```js
const response = await client.catalog.searchComments({
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
const popular = await client.catalog.getPopularItems();

const lastWeek = popular.items_last_week;
const lastThreeMonths = popular.items_last_three_months;
const authorsLastMonth = popular.authors_last_month;
```

#### Get categories by site

Lists the categories of a particular site.

```js
const categories = await client.catalog.getCategories('codecanyon');

for (const category of categories) {
    console.log('%s (%s)', category.name, category.path);
}
```

#### Get prices for an item

Return available licenses and prices for the given item ID. Throws an error if the item is not found.

```js
const prices = await client.catalog.getItemPrices(123456);

for (const entry of prices) {
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
const items = await client.catalog.getNewFiles('codecanyon', 'php-scripts');

for (const item of items) {
    console.log(item.id, item.name);
}
```

#### Find featured items and authors

Shows the current site features.

```js
const features = await client.catalog.getFeatures('codecanyon');

const featuredMonthlyFile = features.featured_file;
const featuredAuthor = features.featured_author;
const freeMonthlyFile = features.free_file;
```

#### Get random new items

Shows a random list of newly uploaded files from a particular site (i.e. like the homepage). This doesn't actually appear to be random at this time, but rather sorted by newest first. Could change in future since the endpoint is officially documented to return random results.

```js
const items = await client.catalog.getRandomNewFiles('codecanyon');

for (const item of items) {
    console.log(item.id, item.name);
}
```

### User

#### List a user's collections

Lists all of the user's private and public collections.

```js
const collections = await client.user.getCollections();

for (const collection of collections) {
    console.log(collection.id, collection.name);
}
```

#### Look up a user's private collection

Returns details and items for public or the user's private collections. Returns `undefined` if the collection is not
found.

```js
const { collection, items } = await client.user.getPrivateCollection(123456);

console.log('Collection:', collection.id, collection.name);

for (const item of items) {
    console.log('Item:', item.id, item.name);
}
```

#### Get a user's profile details

Shows username, country, number of sales, number of followers, location and image for a user.

```js
const user = await client.user.getAccountDetails('baileyherbert');

console.log('Username:', user.username);
console.log('Sales:', user.sales);
console.log('Avatar URL:', user.image);
```

#### List a user's badges

Shows a list of badges for the given user.

```js
const badges = await client.user.getBadges('baileyherbert');

for (const badge of badges) {
    console.log('Badge:', badge.name, badge.label, badge.image);
}
```

#### Get a user's item count per marketplace

Show the number of items an author has for sale on each site.

```js
const counts = await client.user.getItemsBySite('baileyherbert');

for (const count of counts) {
    console.log('The user has %d items on %s', count.items, count.site);
}
```

#### Get a user's newest items

Shows up to 1000 newest files uploaded by a user to a particular site.

```js
const items = await client.user.getNewItems('baileyherbert', 'codecanyon');

for (const item of items) {
    console.log(item.id, item.name);
}
```

### Private user

#### List an author's sales

Lists all unrefunded sales of the authenticated user's items listed on Envato Market. Author sales data ("Amount") is reported before subtraction of any income taxes (eg US Royalty Withholding Tax).

```js
const sales = await client.private.getSales();

for (const sale of sales) {
    console.log('Sold %s for $%s', sale.item.name, sale.amount);
}
```

#### Look up a sale by code

Returns the details of an author's sale identified by the purchase code. Author sales data ("Amount") is reported before subtraction of any income taxes (eg US Royalty Withholding Tax).
Returns `undefined` if the sale is not found.

```js
const sale = await client.private.getSale('purchase-code');

console.log('Buyer:', sale.buyer);
console.log('Item:', sale.item.id, sale.item.name);
```

#### List all purchases

List purchases that the user has made on their account.

```js
const purchases = await client.private.getPurchases();
```

#### List a buyer's purchases

Lists all purchases that the authenticated user has made of the app creator's listed items. Only works with OAuth tokens.

```js
const { purchases } = await client.private.getPurchasesFromAppCreator();

for (const purchase of purchases) {
    console.log('Bought %s (purchase code: %s)', purchase.item.name, purchase.code);
}
```

#### Look up a purchase by code

Returns the details of a user's purchase identified by the purchase code. Returns `undefined` if the purchase is not
found.

```js
const purchase = await client.private.getPurchase('purchase-code');
```

#### Get a user's account details

Returns the first name, surname, earnings available to withdraw, total deposits, balance (deposits + earnings) and country.

```js
const account = await client.private.getAccountDetails();
```

#### Get a user's username

Returns the currently logged in user's Envato Account username as a string.

```js
const username = await client.private.getUsername();
```

#### Get a user's email

Returns the currently logged in user's email address as a string.

```js
const email = await client.private.getEmail();
```

#### Get an author's monthly sales

Returns the monthly sales data, as displayed on the user's earnings page. Monthly sales data ("Earnings") is reported before subtraction of any income taxes (eg US Royalty Withholding Tax).

```js
const sales = await client.private.getMonthlySales();
```

#### Get statement data

Lists transactions from the user's statement page.

```js
const response = await client.private.getStatement();
```

#### Download a purchase

Download purchased items by either the item_id or the purchase_code. Each invocation of this endpoint will count against the items daily download limit. Returns a string containing the one-time download link.

```js
const url = await client.private.getDownloadLink({
    item_id: 123456
});
```

### Statistics

#### Get the total number of market users

Returns the total number of subscribed users to Envato Market.

```js
const users = await client.stats.getTotalUsers();
```

#### Get the total number of market items

Returns the total number of items available on Envato Market.

```js
const items = await client.stats.getTotalItems();
```

#### Get the number of items per category

Returns the total number of items available on Envato Market.

```js
const categories = await client.stats.getFilesPerCategory();
```

## Error handling

When sending a request, you should always be prepared to handle errors in the case of an invalid token or server outage. If you're using the `await` operator, then you should surround your calls in a try/catch block:

```js
try {
    const email = await client.private.getEmail();
}
catch (error) {
    if (error instanceof Envato.HttpError) {
        console.error('Status:', error.code);
        console.error('Message:', error.message);
        console.error('More details:', error.response);
    }
    else if (error instanceof Envato.OAuthError) {
        console.error('Failed to renew OAuth session.');
    }
    else {
        console.error('Got an error from request.');
    }
}
```

As shown in the code above, requests can throw 3 different types of errors. The first is an instance of `Envato.HttpError`, which will contain a message such as "Unauthorized" or "Bad Request". It will also usually provide a `response` object which will look something like below, though under rare circumstances this object may be `undefined`:

```json
{
    "error": 400,
    "description": "An optional description of the error here"
}
```

The second type of error is an `Envato.OAuthError`, which only applies to OAuth-based clients, and will be thrown when renewal of the OAuth session fails (which might happen if the user revokes your application's access to their account, or if there's an API outage). This error will contain an `http` property that will expose the underlying `Envato.HttpError` if applicable.

The third type of error is an `Envato.FetchError` due to a connection error or timeout.

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

For built-in endpoints that request a specific resource, this library will catch 404 errors and instead return `undefined` if the resource is not found.
However, when sending requests manually, you will need to catch and handle any `Envato.NotFoundError` errors yourself.

- For instance, looking up a purchase code or an item will return `undefined` if the resource is not found.
- On the other hand, attempting to download an item or retrieve an item's prices will reject with a `NotFoundError` if the item doesn't exist.

## Events

The client exposes events that you can listen to using the `on()` and `once()` methods.

### Renew

This event is triggered whenever the client generates a new access token due to the previous token becoming expired. The refresh token always stays the same. This only applies to clients using OAuth.

```js
client.on('renew', function(data) {
    const newAccessToken = data.token;
    const expiration = data.expiration;

    // Store the new data somewhere...
    // Note: The refresh token never changes
});
```

### Debug

This event is triggered once for each request. You can use this to debug problems and see what's going on under the hood, and to log things such as status codes or response times.

```js
client.on('debug', function(response) {
    console.log(
        '[Request] Got %d response back from %s (took %d ms):',
        response.status,
        response.request.url,
        response.took,
        response.body
    );
});
```

### Ratelimit

This event is triggered when the client receives a rate limit error from the API and starts pausing requests until the rate limit expires. It passes a single argument, the duration of the rate limit in milliseconds. During this time, any requests you try to send with the client will be held until the duration expires. This event is only triggered if [`handleRateLimits`](#rate-limiting) is set to `true` (the default).

```js
client.on('ratelimit', function(duration) {
    console.log('Rate limited for %d milliseconds.', duration);
});
```

### Resume

This event is triggered after a rate limit expires and the client begins sending requests again. This event is only triggered if [`handleRateLimits`](#rate-limiting) is set to `true` (the default).

```js
client.on('resume', function() {
    console.log('Rate limit has ended.');
});
```

## Sandboxing

The client has a `sandbox` option which allows you to use my unofficial public sandbox. Currently, only a few endpoints are supported:

- Looking up a sale by purchase code
- Listing all purchases of the app creator's items
- Get the user's email address
- Get the user's username

To use it, simply set the option to true:

```ts
new Envato.Client({
    token: 'your personal token',
    sandbox: true
});
```

You can also specify a base URL to use for a custom sandbox.

```ts
new Envato.Client({
    token: 'your personal token',
    sandbox: 'http://localhost:8080/'
});
```

> 💡 **Note:** When sandbox mode is enabled, the client will automatically remove your personal token and user agent from the request, and a warning will be printed to the console for each request telling you that sandboxing is active.
