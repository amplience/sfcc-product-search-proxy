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
      code: lambda.Code.fromAsset('dist.zip'),
      description: `Generated on ${ new Date().toISOString() }`,
      handler: 'src/index.handler',
      role: new iam.Role(this, 'AllowLambdaServiceToAssumeRole', {
        assumedBy: new iam.CompositePrincipal(
            new iam.ServicePrincipal('lambda.amazonaws.com'),
            new iam.ServicePrincipal('edgelambda.amazonaws.com'),
        ),
        managedPolicies: [ iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole') ],
      })
    });

    const sha = sha256File('./dist.zip');
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
console.log(`STACK_NAME: "${ stackPrefix }"`);
new SFCCProductSearchServerProxyStack(app, stackPrefix + 'Service');
app.synth();


export function addCorsOptions(apiResource: apigateway.IResource) {
  const allowedHeaders = [ 'x-auth-id', 'x-auth-secret' , 'Access-Control-Allow-Origin'];
  allowedHeaders.push(...apigateway.Cors.DEFAULT_HEADERS,);

  const allowedOrigins = [ 'null' ];
  // allowedOrigins.push(...apigateway.Cors.ALL_ORIGINS);
  apiResource.addCorsPreflight({
    statusCode: 200,
    allowOrigins: allowedOrigins,
    allowCredentials: false,
    allowHeaders: allowedHeaders,
    allowMethods: apigateway.Cors.ALL_METHODS,
  });
}
