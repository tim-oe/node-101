"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logConfiguration = void 0;
const winston = require("winston");
//import WinstonCloudWatch from "winston-cloudwatch";
/**
 * simple logging configuration for winston
 * TODO cloudwatch
 */
// Logger configuration
exports.logConfiguration = {
    transports: [
        new (winston.transports.Console)({
            handleExceptions: true,
            level: 'debug',
            format: winston.format.combine(winston.format.errors({ stack: true }), winston.format.splat(), winston.format.timestamp({
                format: 'MMM-DD-YYYY HH:mm:ss'
            }), winston.format.printf((_a) => {
                var { timestamp, level, message } = _a, rest = __rest(_a, ["timestamp", "level", "message"]);
                let restString = JSON.stringify(rest, undefined, 2);
                restString = restString === '{}' ? '' : restString;
                return `[${timestamp}] ${level} - ${message} ${restString}`;
            })),
        }),
    ],
};
//# sourceMappingURL=logging.config.js.map