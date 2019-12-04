import cdk = require('@aws-cdk/core');
import lambda = require("@aws-cdk/aws-lambda");
import iam = require("@aws-cdk/aws-iam");

var sha256File = require('sha256-file');
const stackPrefix = process.env.STACK_NAME || 'GenericSFCCProxyServer'

export class SFCCProductSearchServerProxyStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const handler = new lambda.Function(this, stackPrefix+"Handler", {
            runtime: lambda.Runtime.NODEJS_8_10,
            code: lambda.AssetCode.asset("resources"),
            handler: "lambda-express-wrapper.handler",
            role: new iam.Role(this, 'AllowLambdaServiceToAssumeRole', {
                assumedBy: new iam.CompositePrincipal(
                    new iam.ServicePrincipal('lambda.amazonaws.com'),
                    new iam.ServicePrincipal('edgelambda.amazonaws.com'),
                ),
                managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
            })
        });

        const sha = sha256File('./resources');
        handler.addVersion(':sha256:' + sha);
    }
}

const app = new cdk.App();
console.log(`STACK_NAME: "${stackPrefix}"`)
new SFCCProductSearchServerProxyStack(app, stackPrefix+"Service");
app.synth();
