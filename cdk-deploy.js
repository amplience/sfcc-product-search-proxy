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
console.log(certARN);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWRlcGxveS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNkay1kZXBsb3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBc0M7QUFDdEMsc0RBQXVEO0FBQ3ZELDhDQUErQztBQUMvQyx3Q0FBeUM7QUFDekMsK0RBQWdFO0FBR2hFLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSx3QkFBd0IsQ0FBQztBQUN2RSxNQUFNLFVBQVUsR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVksQ0FBQztBQUNwRCxNQUFNLE9BQU8sR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWdCLENBQUM7QUFFckQsTUFBYSxpQ0FBa0MsU0FBUSxHQUFHLENBQUMsS0FBSztJQUM5RCxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxXQUFXLEdBQUcsU0FBUyxFQUFFO1lBQ2pFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztZQUN2QyxXQUFXLEVBQUUsZ0JBQWlCLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFHLEVBQUU7WUFDekQsT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixJQUFJLEVBQUUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxnQ0FBZ0MsRUFBRTtnQkFDekQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGtCQUFrQixDQUNqQyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQyxFQUNoRCxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQywwQkFBMEIsQ0FBQyxDQUN2RDtnQkFDRCxlQUFlLEVBQUUsQ0FBRSxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLDBDQUEwQyxDQUFDLENBQUU7YUFDNUcsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNyQyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLEVBQUU7UUFDRiwrREFBK0Q7UUFDL0Qsa0JBQWtCO1FBQ2xCLDhCQUE4QjtRQUM5Qix1R0FBdUc7UUFDdkcsT0FBTztRQUNQLG1DQUFtQztRQUNuQyxrRUFBa0U7UUFDbEUsTUFBTTtRQUVOLE1BQU0sUUFBUSxHQUFHLElBQUksVUFBVSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDekUsVUFBVSxFQUFFO2dCQUNWLFVBQVUsRUFBRSxVQUFVO2dCQUN0QixXQUFXLEVBQUUsV0FBVyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsT0FBTyxDQUFDO2FBQ2pHO1lBQ0QsV0FBVyxFQUFFLGdCQUFnQjtZQUM3QixXQUFXLEVBQUUsK0NBQStDO1lBQzVELE9BQU8sRUFBRSxPQUFPO1lBQ2hCLEtBQUssRUFBRSxLQUFLO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDM0QsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFN0IsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNuRSxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUVqQyxDQUFDO0NBQ0Y7QUFsREQsOEVBa0RDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFpQixXQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLElBQUksaUNBQWlDLENBQUMsR0FBRyxFQUFFLFdBQVcsR0FBRyxTQUFTLENBQUMsQ0FBQztBQUNwRSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7QUFHWixTQUFnQixjQUFjLENBQUMsV0FBaUM7SUFDOUQsTUFBTSxjQUFjLEdBQUcsQ0FBRSxXQUFXLEVBQUUsZUFBZSxFQUFHLDZCQUE2QixDQUFDLENBQUM7SUFDdkYsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFFLENBQUM7SUFFekQsTUFBTSxjQUFjLEdBQUcsQ0FBRSxNQUFNLENBQUUsQ0FBQztJQUNsQyx1REFBdUQ7SUFDdkQsV0FBVyxDQUFDLGdCQUFnQixDQUFDO1FBQzNCLFVBQVUsRUFBRSxHQUFHO1FBQ2YsWUFBWSxFQUFFLGNBQWM7UUFDNUIsZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixZQUFZLEVBQUUsY0FBYztRQUM1QixZQUFZLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXO0tBQzFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFiRCx3Q0FhQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjZGsgPSByZXF1aXJlKCdAYXdzLWNkay9jb3JlJyk7XG5pbXBvcnQgYXBpZ2F0ZXdheSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5Jyk7XG5pbXBvcnQgbGFtYmRhID0gcmVxdWlyZSgnQGF3cy1jZGsvYXdzLWxhbWJkYScpO1xuaW1wb3J0IGlhbSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1pYW0nKTtcbmltcG9ydCBjZXJ0aWZpY2F0ZSA9IHJlcXVpcmUoJ0Bhd3MtY2RrL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXInKTtcblxuXG5jb25zdCBzaGEyNTZGaWxlID0gcmVxdWlyZSgnc2hhMjU2LWZpbGUnKTtcbmNvbnN0IHN0YWNrUHJlZml4ID0gcHJvY2Vzcy5lbnYuU1RBQ0tfTkFNRSB8fCAnR2VuZXJpY1NGQ0NQcm94eVNlcnZlcic7XG5jb25zdCBkb21haW5OYW1lOiBzdHJpbmcgPSBwcm9jZXNzLmVudi5ET01BSU5fTkFNRSE7XG5jb25zdCBjZXJ0QVJOOiBzdHJpbmcgPSBwcm9jZXNzLmVudi5DRVJUSUZJQ0FURV9BUk4hO1xuXG5leHBvcnQgY2xhc3MgU0ZDQ1Byb2R1Y3RTZWFyY2hTZXJ2ZXJQcm94eVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsIHN0YWNrUHJlZml4ICsgJ0hhbmRsZXInLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTBfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldCgnZGlzdC56aXAnKSxcbiAgICAgIGRlc2NyaXB0aW9uOiBgR2VuZXJhdGVkIG9uICR7IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSB9YCxcbiAgICAgIGhhbmRsZXI6ICdzcmMvaW5kZXguaGFuZGxlcicsXG4gICAgICByb2xlOiBuZXcgaWFtLlJvbGUodGhpcywgJ0FsbG93TGFtYmRhU2VydmljZVRvQXNzdW1lUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkNvbXBvc2l0ZVByaW5jaXBhbChcbiAgICAgICAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWRnZWxhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICksXG4gICAgICAgIG1hbmFnZWRQb2xpY2llczogWyBpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnKSBdLFxuICAgICAgfSlcbiAgICB9KTtcblxuICAgIGNvbnN0IHNoYSA9IHNoYTI1NkZpbGUoJy4vZGlzdC56aXAnKTtcbiAgICBoYW5kbGVyLmFkZFZlcnNpb24oc2hhKTtcbiAgICAvL1xuICAgIC8vIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ3NmY2MtcHJveHktYXBpJywge1xuICAgIC8vICAgZG9tYWluTmFtZToge1xuICAgIC8vICAgICBkb21haW5OYW1lOiBkb21haW5OYW1lLFxuICAgIC8vICAgICBjZXJ0aWZpY2F0ZTogY2VydGlmaWNhdGUuQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHRoaXMsICdzZmNjLXByb3h5LWNlcnRpZmljYXRlJywgY2VydEFSTilcbiAgICAvLyAgIH0sXG4gICAgLy8gICByZXN0QXBpTmFtZTogJ3NmY2MtcHJveHktYXBpJyxcbiAgICAvLyAgIGRlc2NyaXB0aW9uOiAnUHJveHkgc2VydmVyIGZvciBkZXBsb3lpbmcgc2ZjYyB1aSBleHRlbnNpb24uJyxcbiAgICAvLyB9KTtcblxuICAgIGNvbnN0IHByb3h5QXBpID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhUmVzdEFwaSh0aGlzLCAnc2ZjYy1wcm94eS1yZXN0LWFwaScsIHtcbiAgICAgIGRvbWFpbk5hbWU6IHtcbiAgICAgICAgZG9tYWluTmFtZTogZG9tYWluTmFtZSxcbiAgICAgICAgY2VydGlmaWNhdGU6IGNlcnRpZmljYXRlLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybih0aGlzLCAnc2ZjYy1wcm94eS1jZXJ0aWZpY2F0ZScsIGNlcnRBUk4pXG4gICAgICB9LFxuICAgICAgcmVzdEFwaU5hbWU6ICdzZmNjLXByb3h5LWFwaScsXG4gICAgICBkZXNjcmlwdGlvbjogJ1Byb3h5IHNlcnZlciBmb3IgZGVwbG95aW5nIHNmY2MgdWkgZXh0ZW5zaW9uLicsXG4gICAgICBoYW5kbGVyOiBoYW5kbGVyLFxuICAgICAgcHJveHk6IGZhbHNlXG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9kdWN0c0J5SWQgPSBwcm94eUFwaS5yb290LmFkZFJlc291cmNlKCdwcm9kdWN0cycpO1xuICAgIHByb2R1Y3RzQnlJZC5hZGRNZXRob2QoJ0dFVCcpO1xuICAgIGFkZENvcnNPcHRpb25zKHByb2R1Y3RzQnlJZCk7XG5cbiAgICBjb25zdCBwcm9kdWN0c1NlYXJjaCA9IHByb3h5QXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3Byb2R1Y3Qtc2VhcmNoJyk7XG4gICAgcHJvZHVjdHNTZWFyY2guYWRkTWV0aG9kKCdQT1NUJyk7XG4gICAgYWRkQ29yc09wdGlvbnMocHJvZHVjdHNTZWFyY2gpO1xuXG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnNvbGUubG9nKGNlcnRBUk4pO1xuY29uc29sZS5sb2coYFNUQUNLX05BTUU6IFwiJHsgc3RhY2tQcmVmaXggfVwiYCk7XG5uZXcgU0ZDQ1Byb2R1Y3RTZWFyY2hTZXJ2ZXJQcm94eVN0YWNrKGFwcCwgc3RhY2tQcmVmaXggKyAnU2VydmljZScpO1xuYXBwLnN5bnRoKCk7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZENvcnNPcHRpb25zKGFwaVJlc291cmNlOiBhcGlnYXRld2F5LklSZXNvdXJjZSkge1xuICBjb25zdCBhbGxvd2VkSGVhZGVycyA9IFsgJ3gtYXV0aC1pZCcsICd4LWF1dGgtc2VjcmV0JyAsICdBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nXTtcbiAgYWxsb3dlZEhlYWRlcnMucHVzaCguLi5hcGlnYXRld2F5LkNvcnMuREVGQVVMVF9IRUFERVJTLCk7XG5cbiAgY29uc3QgYWxsb3dlZE9yaWdpbnMgPSBbICdudWxsJyBdO1xuICAvLyBhbGxvd2VkT3JpZ2lucy5wdXNoKC4uLmFwaWdhdGV3YXkuQ29ycy5BTExfT1JJR0lOUyk7XG4gIGFwaVJlc291cmNlLmFkZENvcnNQcmVmbGlnaHQoe1xuICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICBhbGxvd09yaWdpbnM6IGFsbG93ZWRPcmlnaW5zLFxuICAgIGFsbG93Q3JlZGVudGlhbHM6IGZhbHNlLFxuICAgIGFsbG93SGVhZGVyczogYWxsb3dlZEhlYWRlcnMsXG4gICAgYWxsb3dNZXRob2RzOiBhcGlnYXRld2F5LkNvcnMuQUxMX01FVEhPRFMsXG4gIH0pO1xufVxuIl19