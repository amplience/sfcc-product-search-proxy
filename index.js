"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
const iam = require("@aws-cdk/aws-iam");
const certificate = require("@aws-cdk/aws-certificatemanager");
const sha256File = require('sha256-file');
const stackPrefix = process.env.STACK_NAME || 'GenericSFCCProxyServer';
const domainName = process.env.DOMAIN_NAME;
const certARN = process.env.CERTIFICATE_ARN;
class SFCCProductSearchServerProxyStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const handler = new lambda.Function(this, stackPrefix + 'Handler', {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.fromAsset('resources'),
            description: `Generated on ${new Date().toISOString()}`,
            handler: 'lambda-express-wrapper.handler',
            role: new iam.Role(this, 'AllowLambdaServiceToAssumeRole', {
                assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('lambda.amazonaws.com'), new iam.ServicePrincipal('edgelambda.amazonaws.com')),
                managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
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
exports.SFCCProductSearchServerProxyStack = SFCCProductSearchServerProxyStack;
const app = new cdk.App();
console.log(certARN);
console.log(`STACK_NAME: "${stackPrefix}"`);
new SFCCProductSearchServerProxyStack(app, stackPrefix + 'Service');
app.synth();
function addCorsOptions(apiResource) {
    apiResource.addCorsPreflight({
        statusCode: 200,
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowCredentials: false,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        allowMethods: apigateway.Cors.ALL_METHODS,
    });
}
exports.addCorsOptions = addCorsOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFzQztBQUN0QyxzREFBdUQ7QUFDdkQsOENBQStDO0FBQy9DLHdDQUF5QztBQUN6QywrREFBZ0U7QUFHaEUsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLHdCQUF3QixDQUFDO0FBQ3ZFLE1BQU0sVUFBVSxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBWSxDQUFDO0FBQ3BELE1BQU0sT0FBTyxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZ0IsQ0FBQztBQUVyRCxNQUFhLGlDQUFrQyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlELFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsR0FBRyxTQUFTLEVBQUU7WUFDakUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1lBQ3hDLFdBQVcsRUFBRSxnQkFBaUIsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUcsRUFBRTtZQUN6RCxPQUFPLEVBQUUsZ0NBQWdDO1lBQ3pDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGdDQUFnQyxFQUFFO2dCQUN6RCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQ2pDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLEVBQ2hELElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLDBCQUEwQixDQUFDLENBQ3ZEO2dCQUNELGVBQWUsRUFBRSxDQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsMENBQTBDLENBQUMsQ0FBRTthQUM1RyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDekMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixFQUFFO1FBQ0YsK0RBQStEO1FBQy9ELGtCQUFrQjtRQUNsQiw4QkFBOEI7UUFDOUIsdUdBQXVHO1FBQ3ZHLE9BQU87UUFDUCxtQ0FBbUM7UUFDbkMsa0VBQWtFO1FBQ2xFLE1BQU07UUFFTixNQUFNLFFBQVEsR0FBRyxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ3pFLFVBQVUsRUFBRTtnQkFDVixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFLE9BQU8sQ0FBQzthQUNqRztZQUNELFdBQVcsRUFBRSxnQkFBZ0I7WUFDN0IsV0FBVyxFQUFFLCtDQUErQztZQUM1RCxPQUFPLEVBQUUsT0FBTztZQUNoQixLQUFLLEVBQUUsS0FBSztTQUNiLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNELFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTdCLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDbkUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFakMsQ0FBQztDQUNGO0FBbERELDhFQWtEQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBaUIsV0FBWSxHQUFHLENBQUMsQ0FBQztBQUM5QyxJQUFJLGlDQUFpQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDcEUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBR1osU0FBZ0IsY0FBYyxDQUFDLFdBQWlDO0lBQzlELFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztRQUMzQixVQUFVLEVBQUUsR0FBRztRQUNmLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7UUFDekMsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixZQUFZLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlO1FBQzdDLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7S0FDMUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVJELHdDQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NvcmUnKTtcbmltcG9ydCBhcGlnYXRld2F5ID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXknKTtcbmltcG9ydCBsYW1iZGEgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtbGFtYmRhJyk7XG5pbXBvcnQgaWFtID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWlhbScpO1xuaW1wb3J0IGNlcnRpZmljYXRlID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWNlcnRpZmljYXRlbWFuYWdlcicpO1xuXG5cbmNvbnN0IHNoYTI1NkZpbGUgPSByZXF1aXJlKCdzaGEyNTYtZmlsZScpO1xuY29uc3Qgc3RhY2tQcmVmaXggPSBwcm9jZXNzLmVudi5TVEFDS19OQU1FIHx8ICdHZW5lcmljU0ZDQ1Byb3h5U2VydmVyJztcbmNvbnN0IGRvbWFpbk5hbWU6IHN0cmluZyA9IHByb2Nlc3MuZW52LkRPTUFJTl9OQU1FITtcbmNvbnN0IGNlcnRBUk46IHN0cmluZyA9IHByb2Nlc3MuZW52LkNFUlRJRklDQVRFX0FSTiE7XG5cbmV4cG9ydCBjbGFzcyBTRkNDUHJvZHVjdFNlYXJjaFNlcnZlclByb3h5U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgc3RhY2tQcmVmaXggKyAnSGFuZGxlcicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xMF9YLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdyZXNvdXJjZXMnKSxcbiAgICAgIGRlc2NyaXB0aW9uOiBgR2VuZXJhdGVkIG9uICR7IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9YCxcbiAgICAgIGhhbmRsZXI6ICdsYW1iZGEtZXhwcmVzcy13cmFwcGVyLmhhbmRsZXInLFxuICAgICAgcm9sZTogbmV3IGlhbS5Sb2xlKHRoaXMsICdBbGxvd0xhbWJkYVNlcnZpY2VUb0Fzc3VtZVJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5Db21wb3NpdGVQcmluY2lwYWwoXG4gICAgICAgICAgICBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgICBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VkZ2VsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICApLFxuICAgICAgICBtYW5hZ2VkUG9saWNpZXM6IFsgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJykgXSxcbiAgICAgIH0pXG4gICAgfSk7XG5cbiAgICBjb25zdCBzaGEgPSBzaGEyNTZGaWxlKCcuL3BhY2thZ2UuanNvbicpO1xuICAgIGhhbmRsZXIuYWRkVmVyc2lvbihzaGEpO1xuICAgIC8vXG4gICAgLy8gY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaSh0aGlzLCAnc2ZjYy1wcm94eS1hcGknLCB7XG4gICAgLy8gICBkb21haW5OYW1lOiB7XG4gICAgLy8gICAgIGRvbWFpbk5hbWU6IGRvbWFpbk5hbWUsXG4gICAgLy8gICAgIGNlcnRpZmljYXRlOiBjZXJ0aWZpY2F0ZS5DZXJ0aWZpY2F0ZS5mcm9tQ2VydGlmaWNhdGVBcm4odGhpcywgJ3NmY2MtcHJveHktY2VydGlmaWNhdGUnLCBjZXJ0QVJOKVxuICAgIC8vICAgfSxcbiAgICAvLyAgIHJlc3RBcGlOYW1lOiAnc2ZjYy1wcm94eS1hcGknLFxuICAgIC8vICAgZGVzY3JpcHRpb246ICdQcm94eSBzZXJ2ZXIgZm9yIGRlcGxveWluZyBzZmNjIHVpIGV4dGVuc2lvbi4nLFxuICAgIC8vIH0pO1xuXG4gICAgY29uc3QgcHJveHlBcGkgPSBuZXcgYXBpZ2F0ZXdheS5MYW1iZGFSZXN0QXBpKHRoaXMsICdzZmNjLXByb3h5LXJlc3QtYXBpJywge1xuICAgICAgZG9tYWluTmFtZToge1xuICAgICAgICBkb21haW5OYW1lOiBkb21haW5OYW1lLFxuICAgICAgICBjZXJ0aWZpY2F0ZTogY2VydGlmaWNhdGUuQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHRoaXMsICdzZmNjLXByb3h5LWNlcnRpZmljYXRlJywgY2VydEFSTilcbiAgICAgIH0sXG4gICAgICByZXN0QXBpTmFtZTogJ3NmY2MtcHJveHktYXBpJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUHJveHkgc2VydmVyIGZvciBkZXBsb3lpbmcgc2ZjYyB1aSBleHRlbnNpb24uJyxcbiAgICAgIGhhbmRsZXI6IGhhbmRsZXIsXG4gICAgICBwcm94eTogZmFsc2VcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb2R1Y3RzQnlJZCA9IHByb3h5QXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3Byb2R1Y3RzJyk7XG4gICAgcHJvZHVjdHNCeUlkLmFkZE1ldGhvZCgnR0VUJyk7XG4gICAgYWRkQ29yc09wdGlvbnMocHJvZHVjdHNCeUlkKTtcblxuICAgIGNvbnN0IHByb2R1Y3RzU2VhcmNoID0gcHJveHlBcGkucm9vdC5hZGRSZXNvdXJjZSgncHJvZHVjdC1zZWFyY2gnKTtcbiAgICBwcm9kdWN0c1NlYXJjaC5hZGRNZXRob2QoJ1BPU1QnKTtcbiAgICBhZGRDb3JzT3B0aW9ucyhwcm9kdWN0c1NlYXJjaCk7XG5cbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc29sZS5sb2coY2VydEFSTik7XG5jb25zb2xlLmxvZyhgU1RBQ0tfTkFNRTogXCIkeyBzdGFja1ByZWZpeCB9XCJgKTtcbm5ldyBTRkNDUHJvZHVjdFNlYXJjaFNlcnZlclByb3h5U3RhY2soYXBwLCBzdGFja1ByZWZpeCArICdTZXJ2aWNlJyk7XG5hcHAuc3ludGgoKTtcblxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQ29yc09wdGlvbnMoYXBpUmVzb3VyY2U6IGFwaWdhdGV3YXkuSVJlc291cmNlKSB7XG4gIGFwaVJlc291cmNlLmFkZENvcnNQcmVmbGlnaHQoe1xuICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICBhbGxvd09yaWdpbnM6IGFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyxcbiAgICBhbGxvd0NyZWRlbnRpYWxzOiBmYWxzZSxcbiAgICBhbGxvd0hlYWRlcnM6IGFwaWdhdGV3YXkuQ29ycy5ERUZBVUxUX0hFQURFUlMsXG4gICAgYWxsb3dNZXRob2RzOiBhcGlnYXRld2F5LkNvcnMuQUxMX01FVEhPRFMsXG4gIH0pO1xufVxuIl19