import cdk = require('@aws-cdk/core');
import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import iam = require('@aws-cdk/aws-iam');
import certificate = require('@aws-cdk/aws-certificatemanager');


const sha256File = require('sha256-file');
const stackPrefix = process.env.STACK_NAME || 'GenericSFCCProxyServer';
const domainName: string = process.env.DOMAIN_NAME!;
const certARN: string = process.env.CERTIFICATE_ARN!;

export class SFCCProductSearchServerProxyStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, stackPrefix + 'Handler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('resources'),
      description: `Generated on ${ new Date().toISOString() }`,
      handler: 'lambda-express-wrapper.handler',
      role: new iam.Role(this, 'AllowLambdaServiceToAssumeRole', {
        assumedBy: new iam.CompositePrincipal(
            new iam.ServicePrincipal('lambda.amazonaws.com'),
            new iam.ServicePrincipal('edgelambda.amazonaws.com'),
        ),
        managedPolicies: [ iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole') ],
      })
    });

    const sha = sha256File('./package.json');
    handler.addVersion(sha);
    //
    // const api = new apigateway.RestApi(this, 'sfcc-proxy-api', {
    //   domainName: {
    //     domainName: domainName,
    //     certificate: certificate.Certificate.fromCertificateArn(this, 'sfcc-proxy-certificate', certARN)
    //   },
    //   restApiName: 'sfcc-proxy-api',
    //   description: 'Proxy server for deploying sfcc ui extension.',
    // });

    const proxyApi = new apigateway.LambdaRestApi(this, 'sfcc-proxy-rest-api', {
      domainName: {
        domainName: domainName,
        certificate: certificate.Certificate.fromCertificateArn(this, 'sfcc-proxy-certificate', certARN)
      },
      restApiName: 'sfcc-proxy-api',
      description: 'Proxy server for deploying sfcc ui extension.',
      handler: handler,
      proxy: false
    });

    const productsById = proxyApi.root.addResource('products');
    productsById.addMethod('GET');
    addCorsOptions(productsById);

    const productsSearch = proxyApi.root.addResource('product-search');
    productsSearch.addMethod('POST');
    addCorsOptions(productsSearch);

  }
}

const app = new cdk.App();
console.log(certARN);
console.log(`STACK_NAME: "${ stackPrefix }"`);
new SFCCProductSearchServerProxyStack(app, stackPrefix + 'Service');
app.synth();


export function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addCorsPreflight({
    statusCode: 200,
    allowOrigins: apigateway.Cors.ALL_ORIGINS,
    allowCredentials: false,
    allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
    allowMethods: apigateway.Cors.ALL_METHODS,
  });
}
