"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var cdk = require("@aws-cdk/core");
var lambda = require("@aws-cdk/aws-lambda");
var iam = require("@aws-cdk/aws-iam");
var sha256File = require('sha256-file');
var stackPrefix = process.env.STACK_NAME || 'GenericSFCCProxyServer';
var SFCCProductSearchServerProxyStack = /** @class */ (function (_super) {
    __extends(SFCCProductSearchServerProxyStack, _super);
    function SFCCProductSearchServerProxyStack(scope, id, props) {
        var _this = _super.call(this, scope, id, props) || this;
        var handler = new lambda.Function(_this, stackPrefix + "Handler", {
            runtime: lambda.Runtime.NODEJS_8_10,
            code: lambda.AssetCode.asset("resources"),
            handler: "lambda-express-wrapper.handler",
            role: new iam.Role(_this, 'AllowLambdaServiceToAssumeRole', {
                assumedBy: new iam.CompositePrincipal(new iam.ServicePrincipal('lambda.amazonaws.com'), new iam.ServicePrincipal('edgelambda.amazonaws.com')),
                managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')]
            })
        });
        var sha = sha256File('./resources');
        handler.addVersion(':sha256:' + sha);
        return _this;
    }
    return SFCCProductSearchServerProxyStack;
}(cdk.Stack));
exports.SFCCProductSearchServerProxyStack = SFCCProductSearchServerProxyStack;
var app = new cdk.App();
console.log("STACK_NAME: \"" + stackPrefix + "\"");
new SFCCProductSearchServerProxyStack(app, stackPrefix + "Service");
app.synth();
