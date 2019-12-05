#!/usr/bin/env node
"use strict";
exports.__esModule = true;
require("source-map-support/register");
var cdk = require("@aws-cdk/core");
var test_stack_1 = require("../lib/test-stack");
var app = new cdk.App();
new test_stack_1.TestStack(app, 'TestStack');
