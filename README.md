# Envato API

This package is an asynchronous implementation of the new [Envato API](https://build.envato.com/) and provides an easy interface for accessing all applicable methods. At the moment, this package only supports personal token authentication, not OAuth.

## Motivation

I wanted an easy wrapper for the Envato API which would simplfy the way you pass variables and handle errors automatically, returning a raw JSON response. This package does just that.

* All variables are passed via one object.
* Returns a promise object.
* Resolves with the parsed JSON output.
* Rejects with any errors.

## Installation

```
npm install --save envato-api
```

## Usage

First you must require the package into your module. Note that the package exports a function which is used for setting your personal token and user agent.

Be sure to replace the two variables.

* `PERSONAL_TOKEN` is the secret token you retrieved from https://build.envato.com/my-apps.
* `USER_AGENT` is a description of your script only visible to the Envato API team. You should include your contact email and a short description of what your script does.

```js
var EnvatoAPI = require('envato-api')('PERSONAL_TOKEN', 'USER_AGENT');
```

## Methods

Each method is detailed at https://build.envato.com/api/. All parameter names are the same, and should be passed inside an object.

### Envato Market Catalog

* Look up a public collection — `getCollection({ id: 1234 })`
* Look up a single item — `getItem({ id: 1234 })`
* Search for items — `searchItems({ site: 'codecanyon', term: 'query', ... })`
* Search for comments — `searchComments({ item_id: 1234, term: 'query', ... })`
* Popular items by site — `getPopularItems({ site: 'codecanyon' })`
* Categories by site — `getCategories({ site: 'codecanyon' })`
* Prices for a particular item — `getItemPrices({ item_id: 1234 })`
* New items by site and category — `getNewItems({ site: 'graphicriver', category: 'graphics' })`
* Find featured items — `getFeaturedItems({ site: 'graphicriver' })`
* Random new items — `getRandomNewFiles({ site: 'graphicriver' })`

### User Details

* List all of your collections — `getUserCollections()`
* Look up a user's private collection — `getPrivateCollection({ id: 567890 })`
* User account details — `getUsersDetails({ username: 'collis' })`
* List a user's badges — `getUsersBadges({ username: 'collis' })`
* A user's items by site — `getUsersItems({ username: 'collis' })`
* New items by user — `getUsersNewItems({ username: 'collis', site: 'graphicriver' })`

### Private User Details

* List your sales — `getSales({ page: 1 })`
* Look up sale by code — `getSaleByCode({ code: '123-456-789' })`
* List purchases — `getPurchases({ page: 1 })`
* Look up purchase by code — `getPurchaseByCode({ code: '123-456-789' })`
* User account details — `getPrivateUserDetails()`
* Get a user's username — `getUsername()`
* Get a user's email — `getEmail()`
* Sales by month — `getSalesByMonth({ ... })`

### Envato Market Stats

* Total Envato Market users — `getTotalMarketUsers()`
* Total Envato Market items — `getTotalMarketItems()`
* Number of files in category — `getTotalFilesBySite({ site: 'codecanyon' })`

## Return

Each method will return a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) which will resolve with the parsed JSON object or reject with an error.
The output is not modified, so the output is the same as on [build.envato.com](https://build.envato.com/api/).

```js
EnvatoAPI.getUsername().then(
    function (response) {
        console.log('Current user is:', response.username);
    },
    function (error) {
        console.log('Error:', error.message);
    }
);
```

## Errors

The `error.message` property will contain the following under these circumstances:

* `Bad Request` when invalid parameters are sent or required parameters are missing.
* `Unauthorized` when the personal token is invalid.
* `Access Denied` when you've reached your rate limit or are banned.
* `Not Found` when no matches or results were found by the endpoint.
* `Internal Server Error` when the API is experiencing problems.
* `Request Error: <message>` when there's an error executing the HTTP request.
  * Timeout errors
  * Connection errors
  * SSL errors
* `Error code <000>: <message>` when another HTTP code is received than those above.
