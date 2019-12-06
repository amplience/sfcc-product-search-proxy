# SFCC Product Search Proxy Server

This project creates a proxy server that is meant to be used with the /\SFCC product selector ui url/\\.


## Building

Build locally:
```
$ npm install
$ npm run-script build
```
### Running the Server Locally
```
$ nodemon
```

### Request Parameters

#### Product Search

1. site_ids     | String    |
2. search_text  | String    | minimum length: 3
3. endpoint     | String    |
4. catalog_id?  | String    |
5. page         | Int       |

request;

```
type; POST
endpoint; /product-search
headers;
    Content-Type; application/json
    x-auth-id; AUTH-ID
    x-auth-secret; AUTH-SECRET
    "proxyUrl": "http://localhost:8080",
    "sfccUrl": "https://SFCCURL",
body;
    {
	"site_id":"SITEID",
	"search_text": "shoe",
	"endpoint": "https://endpoint.endpoint.com",
        "catalog_id": "CATALOGID"
	"page": 0
    }
```

#### Products

1. Endpoint | String
2. ids      | Array
3. site_id  | String

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
    "proxyUrl": "http://localhost:8080",
    "sfccUrl": "https://SFCCURL",

http://localhost:8080/products?site_id=SITEID&endpoint=https://endpoint.endpoint.com&ids[]=123456&ids[]=123457
```

## CDK

