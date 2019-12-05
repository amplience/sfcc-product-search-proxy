"use strict";
exports.__esModule = true;
var debug_1 = require("debug");
var DebugLoggerImpl = /** @class */ (function () {
    function DebugLoggerImpl(namespace, additionalContext) {
        this.setupLogs(namespace);
        this.additionalContextFn = additionalContext;
    }
    DebugLoggerImpl.prototype.debug = function (message) {
        var context = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            context[_i - 1] = arguments[_i];
        }
        this.logWrapper('debug', message, context);
    };
    DebugLoggerImpl.prototype.error = function (message) {
        var context = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            context[_i - 1] = arguments[_i];
        }
        this.logWrapper('error', message, context);
    };
    DebugLoggerImpl.prototype.info = function (message) {
        var context = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            context[_i - 1] = arguments[_i];
        }
        this.logWrapper('info', message, context);
    };
    DebugLoggerImpl.prototype.warn = function (message) {
        var context = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            context[_i - 1] = arguments[_i];
        }
        this.logWrapper('warn', message, context);
    };
    DebugLoggerImpl.prototype.setupLogs = function (namespace) {
        var _this = this;
        this.loggers = {
            debug: debug_1.debug(namespace + ":debug"),
            info: debug_1.debug(namespace + ":info"),
            warn: debug_1.debug(namespace + ":warn"),
            error: debug_1.debug(namespace + ":error")
        };
        Object.keys(this.loggers).forEach(function (key) {
            var item = _this.loggers[key];
            item.log = console.log.bind(console);
        });
    };
    DebugLoggerImpl.prototype.logWrapper = function (level, message, context) {
        if (this.additionalContextFn) {
            var loggingContext = this.additionalContextFn();
            if (loggingContext) {
                context.push(loggingContext);
            }
        }
        this.loggers[level].apply(null, [message].concat(context));
    };
    return DebugLoggerImpl;
}());
var logger = new DebugLoggerImpl(process.env.APP_NAME || 'sfcc-product-search-proxy');
function getLogger() {
    return logger;
}
exports.getLogger = getLogger;
