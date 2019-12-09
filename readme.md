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

| Parameter   | Type   |          |
| ----------- |:------:| --------:|
| site_ids    | String | Required |
| search_text | String | Required |
| endpoint    | String | Required |
| catalog_id  | String | Optional |
| page        | Int    | Required |

request;

```
type; POST
endpoint; /product-search
headers;
    Content-Type; application/json
    x-auth-id; AUTH-ID
    x-auth-secret; AUTH-SECRET
    proxyUrl; http://localhost:8080
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

#### Products

| Parameter | Type    |          |
| --------- |:-------:| --------:|
| Endpoint  | String  | Required |
| ids       | Array   | Required |
| site_id   | String  | Required |

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
    proxyUrl; http://localhost:8080
    sfccUrl; https://SFCCURL

http://localhost:8080/products?site_id=SITEID&endpoint=https://endpoint.endpoint.com&ids[]=123456&ids[]=123457
```

## CDK

