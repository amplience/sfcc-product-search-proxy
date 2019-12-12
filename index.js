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
            runtime: lambda.Runtime.NODEJS_8_10,
            code: lambda.AssetCode.asset('resources'),
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
// const corsResponse = new apigateway.MockIntegration({
//   integrationResponses: [ {
//     statusCode: '200',
//     responseParameters: {
//       'method.response.header.Access-Control-Allow-Headers': '\'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent\'',
//       'method.response.header.Access-Control-Allow-Origin': '\'*\'',
//       'method.response.header.Access-Control-Allow-Credentials': '\'false\'',
//       'method.response.header.Access-Control-Allow-Methods': '\'OPTIONS,GET,PUT,POST,DELETE\'',
//     },
//   } ],
//   passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
//   requestTemplates: {
//     'application/json': '{"statusCode": 200}'
//   },
// });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFzQztBQUN0QyxzREFBdUQ7QUFDdkQsOENBQStDO0FBQy9DLHdDQUF5QztBQUN6QywrREFBZ0U7QUFHaEUsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzFDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLHdCQUF3QixDQUFDO0FBQ3ZFLE1BQU0sVUFBVSxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBWSxDQUFDO0FBQ3BELE1BQU0sT0FBTyxHQUFXLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZ0IsQ0FBQztBQUVyRCxNQUFhLGlDQUFrQyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlELFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFdBQVcsR0FBRyxTQUFTLEVBQUU7WUFDakUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1lBQ3pDLFdBQVcsRUFBRSxnQkFBaUIsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUcsRUFBRTtZQUN6RCxPQUFPLEVBQUUsZ0NBQWdDO1lBQ3pDLElBQUksRUFBRSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGdDQUFnQyxFQUFFO2dCQUN6RCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQ2pDLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLEVBQ2hELElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLDBCQUEwQixDQUFDLENBQ3ZEO2dCQUNELGVBQWUsRUFBRSxDQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMsMENBQTBDLENBQUMsQ0FBRTthQUM1RyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDekMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixFQUFFO1FBQ0YsK0RBQStEO1FBQy9ELGtCQUFrQjtRQUNsQiw4QkFBOEI7UUFDOUIsdUdBQXVHO1FBQ3ZHLE9BQU87UUFDUCxtQ0FBbUM7UUFDbkMsa0VBQWtFO1FBQ2xFLE1BQU07UUFFTixNQUFNLFFBQVEsR0FBRyxJQUFJLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ3pFLFVBQVUsRUFBRTtnQkFDVixVQUFVLEVBQUUsVUFBVTtnQkFDdEIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFLE9BQU8sQ0FBQzthQUNqRztZQUNELFdBQVcsRUFBRSxnQkFBZ0I7WUFDN0IsV0FBVyxFQUFFLCtDQUErQztZQUM1RCxPQUFPLEVBQUUsT0FBTztZQUNoQixLQUFLLEVBQUUsS0FBSztTQUNiLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNELFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRTdCLE1BQU0sY0FBYyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDbkUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFakMsQ0FBQztDQUNGO0FBbERELDhFQWtEQztBQUVELHdEQUF3RDtBQUN4RCw4QkFBOEI7QUFDOUIseUJBQXlCO0FBQ3pCLDRCQUE0QjtBQUM1Qiw0SkFBNEo7QUFDNUosdUVBQXVFO0FBQ3ZFLGdGQUFnRjtBQUNoRixrR0FBa0c7QUFDbEcsU0FBUztBQUNULFNBQVM7QUFDVCwrREFBK0Q7QUFDL0Qsd0JBQXdCO0FBQ3hCLGdEQUFnRDtBQUNoRCxPQUFPO0FBQ1AsTUFBTTtBQUNOLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBaUIsV0FBWSxHQUFHLENBQUMsQ0FBQztBQUM5QyxJQUFJLGlDQUFpQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDcEUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBR1osU0FBZ0IsY0FBYyxDQUFDLFdBQWlDO0lBQzlELFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztRQUMzQixVQUFVLEVBQUUsR0FBRztRQUNmLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7UUFDekMsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixZQUFZLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlO1FBQzdDLFlBQVksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVc7S0FDMUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVJELHdDQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNkayA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2NvcmUnKTtcbmltcG9ydCBhcGlnYXRld2F5ID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXknKTtcbmltcG9ydCBsYW1iZGEgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtbGFtYmRhJyk7XG5pbXBvcnQgaWFtID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWlhbScpO1xuaW1wb3J0IGNlcnRpZmljYXRlID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWNlcnRpZmljYXRlbWFuYWdlcicpO1xuXG5cbmNvbnN0IHNoYTI1NkZpbGUgPSByZXF1aXJlKCdzaGEyNTYtZmlsZScpO1xuY29uc3Qgc3RhY2tQcmVmaXggPSBwcm9jZXNzLmVudi5TVEFDS19OQU1FIHx8ICdHZW5lcmljU0ZDQ1Byb3h5U2VydmVyJztcbmNvbnN0IGRvbWFpbk5hbWU6IHN0cmluZyA9IHByb2Nlc3MuZW52LkRPTUFJTl9OQU1FITtcbmNvbnN0IGNlcnRBUk46IHN0cmluZyA9IHByb2Nlc3MuZW52LkNFUlRJRklDQVRFX0FSTiE7XG5cbmV4cG9ydCBjbGFzcyBTRkNDUHJvZHVjdFNlYXJjaFNlcnZlclByb3h5U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgc3RhY2tQcmVmaXggKyAnSGFuZGxlcicsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU184XzEwLFxuICAgICAgY29kZTogbGFtYmRhLkFzc2V0Q29kZS5hc3NldCgncmVzb3VyY2VzJyksXG4gICAgICBkZXNjcmlwdGlvbjogYEdlbmVyYXRlZCBvbiAkeyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfWAsXG4gICAgICBoYW5kbGVyOiAnbGFtYmRhLWV4cHJlc3Mtd3JhcHBlci5oYW5kbGVyJyxcbiAgICAgIHJvbGU6IG5ldyBpYW0uUm9sZSh0aGlzLCAnQWxsb3dMYW1iZGFTZXJ2aWNlVG9Bc3N1bWVSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQ29tcG9zaXRlUHJpbmNpcGFsKFxuICAgICAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlZGdlbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgKSxcbiAgICAgICAgbWFuYWdlZFBvbGljaWVzOiBbIGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScpIF0sXG4gICAgICB9KVxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2hhID0gc2hhMjU2RmlsZSgnLi9wYWNrYWdlLmpzb24nKTtcbiAgICBoYW5kbGVyLmFkZFZlcnNpb24oc2hhKTtcbiAgICAvL1xuICAgIC8vIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ3NmY2MtcHJveHktYXBpJywge1xuICAgIC8vICAgZG9tYWluTmFtZToge1xuICAgIC8vICAgICBkb21haW5OYW1lOiBkb21haW5OYW1lLFxuICAgIC8vICAgICBjZXJ0aWZpY2F0ZTogY2VydGlmaWNhdGUuQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHRoaXMsICdzZmNjLXByb3h5LWNlcnRpZmljYXRlJywgY2VydEFSTilcbiAgICAvLyAgIH0sXG4gICAgLy8gICByZXN0QXBpTmFtZTogJ3NmY2MtcHJveHktYXBpJyxcbiAgICAvLyAgIGRlc2NyaXB0aW9uOiAnUHJveHkgc2VydmVyIGZvciBkZXBsb3lpbmcgc2ZjYyB1aSBleHRlbnNpb24uJyxcbiAgICAvLyB9KTtcblxuICAgIGNvbnN0IHByb3h5QXBpID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhUmVzdEFwaSh0aGlzLCAnc2ZjYy1wcm94eS1yZXN0LWFwaScsIHtcbiAgICAgIGRvbWFpbk5hbWU6IHtcbiAgICAgICAgZG9tYWluTmFtZTogZG9tYWluTmFtZSxcbiAgICAgICAgY2VydGlmaWNhdGU6IGNlcnRpZmljYXRlLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybih0aGlzLCAnc2ZjYy1wcm94eS1jZXJ0aWZpY2F0ZScsIGNlcnRBUk4pXG4gICAgICB9LFxuICAgICAgcmVzdEFwaU5hbWU6ICdzZmNjLXByb3h5LWFwaScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1Byb3h5IHNlcnZlciBmb3IgZGVwbG95aW5nIHNmY2MgdWkgZXh0ZW5zaW9uLicsXG4gICAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgICAgcHJveHk6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9kdWN0c0J5SWQgPSBwcm94eUFwaS5yb290LmFkZFJlc291cmNlKCdwcm9kdWN0cycpO1xuICAgIHByb2R1Y3RzQnlJZC5hZGRNZXRob2QoJ0dFVCcpO1xuICAgIGFkZENvcnNPcHRpb25zKHByb2R1Y3RzQnlJZCk7XG5cbiAgICBjb25zdCBwcm9kdWN0c1NlYXJjaCA9IHByb3h5QXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3Byb2R1Y3Qtc2VhcmNoJyk7XG4gICAgcHJvZHVjdHNTZWFyY2guYWRkTWV0aG9kKCdQT1NUJyk7XG4gICAgYWRkQ29yc09wdGlvbnMocHJvZHVjdHNTZWFyY2gpO1xuXG4gIH1cbn1cblxuLy8gY29uc3QgY29yc1Jlc3BvbnNlID0gbmV3IGFwaWdhdGV3YXkuTW9ja0ludGVncmF0aW9uKHtcbi8vICAgaW50ZWdyYXRpb25SZXNwb25zZXM6IFsge1xuLy8gICAgIHN0YXR1c0NvZGU6ICcyMDAnLFxuLy8gICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuLy8gICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6ICdcXCdDb250ZW50LVR5cGUsWC1BbXotRGF0ZSxBdXRob3JpemF0aW9uLFgtQXBpLUtleSxYLUFtei1TZWN1cml0eS1Ub2tlbixYLUFtei1Vc2VyLUFnZW50XFwnJyxcbi8vICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICdcXCcqXFwnJyxcbi8vICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogJ1xcJ2ZhbHNlXFwnJyxcbi8vICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiAnXFwnT1BUSU9OUyxHRVQsUFVULFBPU1QsREVMRVRFXFwnJyxcbi8vICAgICB9LFxuLy8gICB9IF0sXG4vLyAgIHBhc3N0aHJvdWdoQmVoYXZpb3I6IGFwaWdhdGV3YXkuUGFzc3Rocm91Z2hCZWhhdmlvci5ORVZFUixcbi8vICAgcmVxdWVzdFRlbXBsYXRlczoge1xuLy8gICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ3tcInN0YXR1c0NvZGVcIjogMjAwfSdcbi8vICAgfSxcbi8vIH0pO1xuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnNvbGUubG9nKGNlcnRBUk4pO1xuY29uc29sZS5sb2coYFNUQUNLX05BTUU6IFwiJHsgc3RhY2tQcmVmaXggfVwiYCk7XG5uZXcgU0ZDQ1Byb2R1Y3RTZWFyY2hTZXJ2ZXJQcm94eVN0YWNrKGFwcCwgc3RhY2tQcmVmaXggKyAnU2VydmljZScpO1xuYXBwLnN5bnRoKCk7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZENvcnNPcHRpb25zKGFwaVJlc291cmNlOiBhcGlnYXRld2F5LklSZXNvdXJjZSkge1xuICBhcGlSZXNvdXJjZS5hZGRDb3JzUHJlZmxpZ2h0KHtcbiAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgYWxsb3dPcmlnaW5zOiBhcGlnYXRld2F5LkNvcnMuQUxMX09SSUdJTlMsXG4gICAgYWxsb3dDcmVkZW50aWFsczogZmFsc2UsXG4gICAgYWxsb3dIZWFkZXJzOiBhcGlnYXRld2F5LkNvcnMuREVGQVVMVF9IRUFERVJTLFxuICAgIGFsbG93TWV0aG9kczogYXBpZ2F0ZXdheS5Db3JzLkFMTF9NRVRIT0RTLFxuICB9KTtcbn1cbiJdfQ==