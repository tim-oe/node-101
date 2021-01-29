import winston = require("winston");
//import WinstonCloudWatch from "winston-cloudwatch";

/**
 * simple logging configuration for winston
 * TODO cloudwatch
 */

// Logger configuration
export const logConfiguration = {
  transports: [
    new (winston.transports.Console)({
        handleExceptions: true,
        level: 'debug',
        format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.timestamp({
                format: 'MMM-DD-YYYY HH:mm:ss'
            }),
            winston.format.printf(
                ({
                  timestamp,
                  level,
                  message,
                  ...rest
                }) => {
                  let restString = JSON.stringify(rest, undefined, 2);
                  restString = restString === '{}' ? '' : restString;
      
                  return `[${timestamp}] ${level} - ${message} ${restString}`;
                }),
        ),
      }),      
  ],
};
