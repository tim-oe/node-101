import winston from 'winston';

/**
 * simple logging configuration for winston
 * TODO mongo logging
 */
export const logConfiguration = {
    'transports': [
        new winston.transports.Console({
            level: 'warn',
        }),
        new winston.transports.File({
            level: 'info',
            filename: 'logs/prom-warm-lead.log'
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf(info => `${[info.timestamp]}: ${info.level}: ${info.message}`),
    )
};