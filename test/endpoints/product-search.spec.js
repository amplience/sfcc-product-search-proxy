"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var chai_1 = require("chai");
var product_search_1 = __importDefault(require("../../endpoints/product-search"));
describe('product search', function () {
    it('should succeed when valid request', function () {
        var req = {
            headers: {
                'x-auth-id': 'myId',
                'x-auth-secret': 'mySecret'
            }
        };
        var res = new SimpleResponse();
        chai_1.expect(product_search_1["default"](req, res)).is.undefined;
    });
});
var SimpleResponse = /** @class */ (function () {
    function SimpleResponse() {
    }
    SimpleResponse.prototype.status = function (code) {
        this.code = code;
        return this;
    };
    return SimpleResponse;
}());
