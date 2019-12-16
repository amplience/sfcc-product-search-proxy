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
            code: lambda.Code.fromAsset('dist.zip'),
            description: `Generated on ${new Date().toISOString()}`,
            handler: 'src/index.handler',
            role: new iam.Role(this, 'AllowLambdaServiceToAssumeRole', {
                assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('lambda.amazonaws.com'), new iam.ServicePrincipal('edgelambda.amazonaws.com')),
                managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
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
exports.SFCCProductSearchServerProxyStack = SFCCProductSearchServerProxyStack;
const app = new cdk.App();
console.log(`STACK_NAME: "${stackPrefix}"`);
new SFCCProductSearchServerProxyStack(app, stackPrefix + 'Service');
app.synth();
function addCorsOptions(apiResource) {
    const allowedHeaders = ['x-auth-id', 'x-auth-secret', 'Access-Control-Allow-Origin'];
    allowedHeaders.push(...apigateway.Cors.DEFAULT_HEADERS);
    const allowedOrigins = ['null'];
    // allowedOrigins.push(...apigateway.Cors.ALL_ORIGINS);
    apiResource.addCorsPreflight({
        statusCode: 200,
        allowOrigins: allowedOrigins,
        allowCredentials: false,
        allowHeaders: allowedHeaders,
        allowMethods: apigateway.Cors.ALL_METHODS,
    });
}
exports.addCorsOptions = addCorsOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWRlcGxveS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNkay1kZXBsb3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBc0M7QUFDdEMsc0RBQXVEO0FBQ3ZELDhDQUErQztBQUMvQyx3Q0FBeUM7QUFDekMsK0RBQWdFO0FBR2hFLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSx3QkFBd0IsQ0FBQztBQUN2RSxNQUFNLFVBQVUsR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVksQ0FBQztBQUNwRCxNQUFNLE9BQU8sR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWdCLENBQUM7QUFFckQsTUFBYSxpQ0FBa0MsU0FBUSxHQUFHLENBQUMsS0FBSztJQUM5RCxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLEdBQUcsU0FBUyxFQUFFO1lBQ2pFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUN2QyxXQUFXLEVBQUUsZ0JBQWlCLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFHLEVBQUU7WUFDekQsT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxnQ0FBZ0MsRUFBRTtnQkFDekQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUNqQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxFQUNoRCxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQywwQkFBMEIsQ0FBQyxDQUN2RDtnQkFDRCxlQUFlLEVBQUUsQ0FBRSxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLDBDQUEwQyxDQUFDLENBQUU7YUFDNUcsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNyQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLEVBQUU7UUFDRiwrREFBK0Q7UUFDL0Qsa0JBQWtCO1FBQ2xCLDhCQUE4QjtRQUM5Qix1R0FBdUc7UUFDdkcsT0FBTztRQUNQLG1DQUFtQztRQUNuQyxrRUFBa0U7UUFDbEUsTUFBTTtRQUVOLE1BQU0sUUFBUSxHQUFHLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDekUsVUFBVSxFQUFFO2dCQUNWLFVBQVUsRUFBRSxVQUFVO2dCQUN0QixXQUFXLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsT0FBTyxDQUFDO2FBQ2pHO1lBQ0QsV0FBVyxFQUFFLGdCQUFnQjtZQUM3QixXQUFXLEVBQUUsK0NBQStDO1lBQzVELE9BQU8sRUFBRSxPQUFPO1lBQ2hCLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0QsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFN0IsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNuRSxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUVqQyxDQUFDO0NBQ0Y7QUFsREQsOEVBa0RDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBaUIsV0FBWSxHQUFHLENBQUMsQ0FBQztBQUM5QyxJQUFJLGlDQUFpQyxDQUFDLEdBQUcsRUFBRSxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUM7QUFDcEUsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBR1osU0FBZ0IsY0FBYyxDQUFDLFdBQWlDO0lBQzlELE1BQU0sY0FBYyxHQUFHLENBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRyw2QkFBNkIsQ0FBQyxDQUFDO0lBQ3ZGLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBRSxDQUFDO0lBRXpELE1BQU0sY0FBYyxHQUFHLENBQUUsTUFBTSxDQUFFLENBQUM7SUFDbEMsdURBQXVEO0lBQ3ZELFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQztRQUMzQixVQUFVLEVBQUUsR0FBRztRQUNmLFlBQVksRUFBRSxjQUFjO1FBQzVCLGdCQUFnQixFQUFFLEtBQUs7UUFDdkIsWUFBWSxFQUFFLGNBQWM7UUFDNUIsWUFBWSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVztLQUMxQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBYkQsd0NBYUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY29yZScpO1xuaW1wb3J0IGFwaWdhdGV3YXkgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheScpO1xuaW1wb3J0IGxhbWJkYSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnKTtcbmltcG9ydCBpYW0gPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtaWFtJyk7XG5pbXBvcnQgY2VydGlmaWNhdGUgPSByZXF1aXJlKCdAYXdzLWNkay9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJyk7XG5cblxuY29uc3Qgc2hhMjU2RmlsZSA9IHJlcXVpcmUoJ3NoYTI1Ni1maWxlJyk7XG5jb25zdCBzdGFja1ByZWZpeCA9IHByb2Nlc3MuZW52LlNUQUNLX05BTUUgfHwgJ0dlbmVyaWNTRkNDUHJveHlTZXJ2ZXInO1xuY29uc3QgZG9tYWluTmFtZTogc3RyaW5nID0gcHJvY2Vzcy5lbnYuRE9NQUlOX05BTUUhO1xuY29uc3QgY2VydEFSTjogc3RyaW5nID0gcHJvY2Vzcy5lbnYuQ0VSVElGSUNBVEVfQVJOITtcblxuZXhwb3J0IGNsYXNzIFNGQ0NQcm9kdWN0U2VhcmNoU2VydmVyUHJveHlTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCBzdGFja1ByZWZpeCArICdIYW5kbGVyJywge1xuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEwX1gsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoJ2Rpc3QuemlwJyksXG4gICAgICBkZXNjcmlwdGlvbjogYEdlbmVyYXRlZCBvbiAkeyBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgfWAsXG4gICAgICBoYW5kbGVyOiAnc3JjL2luZGV4LmhhbmRsZXInLFxuICAgICAgcm9sZTogbmV3IGlhbS5Sb2xlKHRoaXMsICdBbGxvd0xhbWJkYVNlcnZpY2VUb0Fzc3VtZVJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5Db21wb3NpdGVQcmluY2lwYWwoXG4gICAgICAgICAgICBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgICBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2VkZ2VsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICApLFxuICAgICAgICBtYW5hZ2VkUG9saWNpZXM6IFsgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJykgXSxcbiAgICAgIH0pXG4gICAgfSk7XG5cbiAgICBjb25zdCBzaGEgPSBzaGEyNTZGaWxlKCcuL2Rpc3QuemlwJyk7XG4gICAgaGFuZGxlci5hZGRWZXJzaW9uKHNoYSk7XG4gICAgLy9cbiAgICAvLyBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdzZmNjLXByb3h5LWFwaScsIHtcbiAgICAvLyAgIGRvbWFpbk5hbWU6IHtcbiAgICAvLyAgICAgZG9tYWluTmFtZTogZG9tYWluTmFtZSxcbiAgICAvLyAgICAgY2VydGlmaWNhdGU6IGNlcnRpZmljYXRlLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybih0aGlzLCAnc2ZjYy1wcm94eS1jZXJ0aWZpY2F0ZScsIGNlcnRBUk4pXG4gICAgLy8gICB9LFxuICAgIC8vICAgcmVzdEFwaU5hbWU6ICdzZmNjLXByb3h5LWFwaScsXG4gICAgLy8gICBkZXNjcmlwdGlvbjogJ1Byb3h5IHNlcnZlciBmb3IgZGVwbG95aW5nIHNmY2MgdWkgZXh0ZW5zaW9uLicsXG4gICAgLy8gfSk7XG5cbiAgICBjb25zdCBwcm94eUFwaSA9IG5ldyBhcGlnYXRld2F5LkxhbWJkYVJlc3RBcGkodGhpcywgJ3NmY2MtcHJveHktcmVzdC1hcGknLCB7XG4gICAgICBkb21haW5OYW1lOiB7XG4gICAgICAgIGRvbWFpbk5hbWU6IGRvbWFpbk5hbWUsXG4gICAgICAgIGNlcnRpZmljYXRlOiBjZXJ0aWZpY2F0ZS5DZXJ0aWZpY2F0ZS5mcm9tQ2VydGlmaWNhdGVBcm4odGhpcywgJ3NmY2MtcHJveHktY2VydGlmaWNhdGUnLCBjZXJ0QVJOKVxuICAgICAgfSxcbiAgICAgIHJlc3RBcGlOYW1lOiAnc2ZjYy1wcm94eS1hcGknLFxuICAgICAgZGVzY3JpcHRpb246ICdQcm94eSBzZXJ2ZXIgZm9yIGRlcGxveWluZyBzZmNjIHVpIGV4dGVuc2lvbi4nLFxuICAgICAgaGFuZGxlcjogaGFuZGxlcixcbiAgICAgIHByb3h5OiBmYWxzZVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvZHVjdHNCeUlkID0gcHJveHlBcGkucm9vdC5hZGRSZXNvdXJjZSgncHJvZHVjdHMnKTtcbiAgICBwcm9kdWN0c0J5SWQuYWRkTWV0aG9kKCdHRVQnKTtcbiAgICBhZGRDb3JzT3B0aW9ucyhwcm9kdWN0c0J5SWQpO1xuXG4gICAgY29uc3QgcHJvZHVjdHNTZWFyY2ggPSBwcm94eUFwaS5yb290LmFkZFJlc291cmNlKCdwcm9kdWN0LXNlYXJjaCcpO1xuICAgIHByb2R1Y3RzU2VhcmNoLmFkZE1ldGhvZCgnUE9TVCcpO1xuICAgIGFkZENvcnNPcHRpb25zKHByb2R1Y3RzU2VhcmNoKTtcblxuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zb2xlLmxvZyhgU1RBQ0tfTkFNRTogXCIkeyBzdGFja1ByZWZpeCB9XCJgKTtcbm5ldyBTRkNDUHJvZHVjdFNlYXJjaFNlcnZlclByb3h5U3RhY2soYXBwLCBzdGFja1ByZWZpeCArICdTZXJ2aWNlJyk7XG5hcHAuc3ludGgoKTtcblxuXG5leHBvcnQgZnVuY3Rpb24gYWRkQ29yc09wdGlvbnMoYXBpUmVzb3VyY2U6IGFwaWdhdGV3YXkuSVJlc291cmNlKSB7XG4gIGNvbnN0IGFsbG93ZWRIZWFkZXJzID0gWyAneC1hdXRoLWlkJywgJ3gtYXV0aC1zZWNyZXQnICwgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbiddO1xuICBhbGxvd2VkSGVhZGVycy5wdXNoKC4uLmFwaWdhdGV3YXkuQ29ycy5ERUZBVUxUX0hFQURFUlMsKTtcblxuICBjb25zdCBhbGxvd2VkT3JpZ2lucyA9IFsgJ251bGwnIF07XG4gIC8vIGFsbG93ZWRPcmlnaW5zLnB1c2goLi4uYXBpZ2F0ZXdheS5Db3JzLkFMTF9PUklHSU5TKTtcbiAgYXBpUmVzb3VyY2UuYWRkQ29yc1ByZWZsaWdodCh7XG4gICAgc3RhdHVzQ29kZTogMjAwLFxuICAgIGFsbG93T3JpZ2luczogYWxsb3dlZE9yaWdpbnMsXG4gICAgYWxsb3dDcmVkZW50aWFsczogZmFsc2UsXG4gICAgYWxsb3dIZWFkZXJzOiBhbGxvd2VkSGVhZGVycyxcbiAgICBhbGxvd01ldGhvZHM6IGFwaWdhdGV3YXkuQ29ycy5BTExfTUVUSE9EUyxcbiAgfSk7XG59XG4iXX0=