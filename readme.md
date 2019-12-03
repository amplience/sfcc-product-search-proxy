[![Amplience Dynamic Content](header.png)](https://amplience.com/dynamic-content)

# SFCC Product Search Proxy Server

This project creates a proxy server that is meant to be used with the /\SFCC product selector ui url/\\.


## Building

Build locally:
```
$ npm install
$ npm run-script build
```
#### Running the Server Locally
```
$ nodemon
```
#### Terminal Scripts

```
$ npm run start
```
Runs the app.
```
$ npm run test
```
Runs the tests.
```
$ npm run build
```
Compiles the typescript.
```
$ npm run watch
```
Runs the app in developer mode, and automatically rebuilds the app when changes are made.
```
$ npm run debug
```
Similar to Watch, however allows debugger to be attached to the app.

### Request Parameters

#### Product Search

| Parameter   | Type   |          | Description |
| ----------- |:------:| --------:|------------:|
| site_id     | String | Required | Id of site |
| search_text | String | Required | text based search parameter |
| endpoint    | String | Required | SFCC server url |
| catalog_id  | String | Optional | Filters products through a specified catalog |
| page        | Int    | Required | Item return page |

request;

```
type; POST
endpoint; /product-search
headers;
    Content-Type; application/json
    x-auth-id; AUTH-ID
    x-auth-secret; AUTH-SECRET
    sfccUrl; https://SFCCURL
body;
    {
	"site_id":"SITEID",
	"search_text": "shoe",
	"endpoint": "https://endpoint.endpoint.com",
        "catalog_id": "CATALOGID"
	"page": 0
    }
```

#### Get Products by Ids

| Parameter | Type    |          | Description |
| --------- |:-------:| --------:| -----------:|
| Endpoint  | String  | Required | SFCC server url |
| ids       | Array   | Required | An array of product Ids |
| site_id   | String  | Required | Id of site |

request example;

```
type; GET
endpoint; /products
params;
    site_id = SITEID
    endpoint = https://endpoint.endpoint.com
    ids[] = 123456
    ids[] = 123457
headers;
    Content-Type; application/json
    x-auth-id; AUTH-ID
    x-auth-secret; AUTH-SECRET
    sfccUrl; https://SFCCURL

http://localhost:8080/products?site_id=SITEID&endpoint=https://endpoint.endpoint.com&ids[]=123456&ids[]=123457
```

#### Extension Example

```
"ui:extension": {
    "url": "http://localhost:3000/",
    "params": {
        "sfccUrl": https://SFCCURL,
        "authSecret": AUTH-SECRET,
        "authClientId": AUTH-ID,
        "siteId": SITEID,
        "backend": "SFCC",
        "catalogs": []
    }
}
```

