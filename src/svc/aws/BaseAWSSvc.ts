import winston = require('winston');
import { Logger } from 'winston';
import { logConfiguration } from "../../config/logging.config";

import { Config } from 'aws-sdk';

//TODO localstack specific...
const baseUrl: string  = 'http://' + process.env.LOCALSTACK_HOSTNAME + ':4566/000000000000/';
export {baseUrl} ;

export default class BaseAWSSvc {

    protected AWS = require('aws-sdk');
    protected logger: Logger = winston.createLogger(logConfiguration);

    protected constructor(config: Config) {
        if(config) {
            // need to set creds before creating sqs client
            // https://stackoverflow.com/questions/56152697/could-not-load-credentials-from-any-providers-when-attempting-upload-to-aws-s3
            this.AWS.config.update(config)           
        }
    }
}