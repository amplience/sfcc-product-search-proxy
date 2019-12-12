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
      runtime: lambda.Runtime.NODEJS_8_10,
      code: lambda.AssetCode.asset('resources'),
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

    const api = new apigateway.RestApi(this, 'sfcc-proxy-api', {
      domainName: {
        domainName: domainName,
        certificate: certificate.Certificate.fromCertificateArn(this, 'sfcc-proxy-certificate', certARN)
      },
      restApiName: 'sfcc-proxy-api',
      description: 'Proxy server for deploying sfcc ui extension.',
    });

    const proxyserver = new apigateway.LambdaIntegration(handler, {
      requestTemplates: {'application/json': '{ "statusCode": "200" }'}
    });

    api.root.addMethod('GET', proxyserver);
    api.root.addMethod('POST', proxyserver);
  }
}

const app = new cdk.App();
console.log(certARN)
console.log(`STACK_NAME: "${ stackPrefix }"`);
new SFCCProductSearchServerProxyStack(app, stackPrefix + 'Service');
app.synth();
