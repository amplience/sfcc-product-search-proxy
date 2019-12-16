import cdk = require('@aws-cdk/core');
import apigateway = require('@aws-cdk/aws-apigateway');
export declare class SFCCProductSearchServerProxyStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps);
}
export declare function addCorsOptions(apiResource: apigateway.IResource): void;
