"use strict";
exports.__esModule = true;
var SimpleResponse = /** @class */ (function () {
    function SimpleResponse() {
    }
    SimpleResponse.prototype.status = function (code) {
        this.code = code;
        return this;
    };
    SimpleResponse.prototype.json = function (json) {
        this.body = json;
        return this;
    };
    return SimpleResponse;
}());
exports.SimpleResponse = SimpleResponse;
