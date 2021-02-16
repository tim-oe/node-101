"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const logging_config_1 = require("../../config/logging.config");
class BaseAWSSvc {
    constructor(config) {
        this.AWS = require('aws-sdk');
        this.logger = winston.createLogger(logging_config_1.logConfiguration);
        if (config) {
            // need to set creds before creating sqs client
            // https://stackoverflow.com/questions/56152697/could-not-load-credentials-from-any-providers-when-attempting-upload-to-aws-s3
            this.AWS.config.update(config);
        }
    }
}
exports.default = BaseAWSSvc;
//# sourceMappingURL=BaseAWSSvc.js.map