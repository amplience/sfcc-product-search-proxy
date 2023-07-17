# SFCC Product Search Proxy Server

[![Build Status](https://travis-ci.org/amplience/sfcc-product-search-proxy.svg?branch=master)](https://travis-ci.org/amplience/sfcc-product-search-proxy)

This project creates a proxy server that is meant to be used with [dc-extension-product-selector](https://github.com/amplience/dc-extension-product-selector).


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

request example;

```
type; POST
endpoint; /product-search
headers;
    Content-Type; application/json
    x-auth-id; {AUTH-ID}
    x-auth-secret; {AUTH-SECRET}
    sfccUrl; https://SFCCURL
    endpoint; https://endpoint.endpoint.com
body;
    {
	"site_id":"SITEID",
	"search_text": "shoe",
	"catalog_id": "CATALOGID",
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
    site_id = {Url to sfcc account}
    ids[] = 123456
    ids[] = 123457
headers;
    Content-Type; application/json
    x-auth-id; {AUTH-ID}
    x-auth-secret; {AUTH-SECRET}
    sfccUrl; https://SFCCURL
    endpoint; https://endpoint.endpoint.com

http://localhost:8080/products?site_id=SITEID&ids[]=123456&ids[]=123457
```

#### Extension Example

```
"ui:extension": {
    "url": "http://localhost:3000/",
    "params": {
        "sfccUrl": https://SFCCURL,
        "authSecret": {AUTH-SECRET},
        "authClientId": {AUTH-ID},
        "siteId": {Url to sfcc account},
        "catalogs": []
    }
}
```

### CDK
This proxy server can easily be deployed to aws lambda using CDK. To do so configure your AWS account to
use CDK in the desired region using bootstrap, note this will not prompt for an MFA token if your acccount
 uses MFA please use :
 ```
$ aws sts get-session-token --serial-number {arn of your mfa device} --token-code {code from MFA provider}
```
This command will return a response in the following format:
```
{
    "Credentials": {
        "SecretAccessKey": "secret-access-key",
        "SessionToken": "temporary-session-token",
        "Expiration": "expiration-date-time",
        "AccessKeyId": "access-key-id"
    }
}
```
We can then use the response to export the following: 
```
$ export AWS_ACCESS_KEY_ID={Credentials.AccessKeyId}
$ export AWS_SECRET_ACCESS_KEY={Credentials.SecretAccessKey}
$ export AWS_SESSION_TOKEN={Credentials.SessionToken}
```
with this complete we can now bootstrap the CDK for our region:
```
$ cdk bootstrap
```
This will bootstrap the region specified in the current profile.
After CDK has been bootstraped we need to build the dist.zip file that will be used by lambda with the 
following:
```
$ npm run-script build
```
Finally all that's left is to deploy the lambda function using CDK:
```
$ CERTIFICATE_ARN='{your certificate amazon resource name}' DOMAIN_NAME='{proxy-domain.certificate-domain}' cdk deploy
```
Please note: CDK supports profile switching using the flag ``` --profile {profile name}```
