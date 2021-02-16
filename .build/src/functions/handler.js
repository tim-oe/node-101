"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.archive = exports.record = exports.echo = void 0;
const config = require("config");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const SQSSvc_1 = __importDefault(require("../svc/aws/SQSSvc"));
const S3Svc_1 = __importDefault(require("../svc/aws/S3Svc"));
const winston = require("winston");
const logging_config_1 = require("../config/logging.config");
const ResponseSvc_1 = __importDefault(require("../svc/ResponseSvc"));
const logger = winston.createLogger(logging_config_1.logConfiguration);
//TODO should be able to get the url based on name or arn...
// https://github.com/localstack/localstack/issues/3068
const baseUlr = 'http://' + process.env.LOCALSTACK_HOSTNAME + ':4566';
// https://stackoverflow.com/questions/61028751/missing-credentials-in-config-if-using-aws-config-file-set-aws-sdk-load-config
// TODO this should not be needed
const awsConfig = new aws_sdk_1.default.Config();
awsConfig.credentials = new aws_sdk_1.default.Credentials("test", "test");
awsConfig.region = config.get('aws.region');
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
// https://github.com/localstack/localstack/issues/948
const sqsConfig = {
    endpoint: baseUlr,
    apiVersion: '2012-11-05'
};
const sqsSvc = new SQSSvc_1.default(config.get('sqs.queue'), awsConfig, sqsConfig);
// in localstack need to set both endpoint and s3ForcePathStyle
// https://github.com/localstack/localstack/issues/3566
const s3Config = {
    endpoint: baseUlr,
    apiVersion: '2006-03-01',
    s3ForcePathStyle: true
};
const s3svc = new S3Svc_1.default(config.get('sqs.queue'), awsConfig, s3Config);
const responseSvc = new ResponseSvc_1.default();
/**
 * API Gateway event handler
 * awslocal apigateway create-rest-api --name click
 * see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 * types gleened from https://github.com/saybou/serverless-typescript-aws/blob/master/handler.ts
 * @param event see https://github.com/awsdocs/aws-lambda-developer-guide/blob/master/sample-apps/nodejs-apig/event.json
 * @param context see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @param callback function that will be used to send response
 */
const echo = (event, context, callback) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('Received api gateway event ', event);
    logger.info('post to sqs success', yield sqsSvc.post(JSON.stringify(event)));
    return responseSvc.response(event);
});
exports.echo = echo;
/**
 * SQS event handler
 * see https://aws.amazon.com/serverless/use-sqs-as-an-event-source-for-lambda-tutorial/
 * @param event see https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
 * @param context see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @param callback function that will be used to send response
 */
const record = (event, context, callback) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info('Received sqs event', event);
    event.Records.forEach((record) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const d = new Date();
            const content = Buffer.from(JSON.stringify(record.body), "utf-8");
            const key = 'click-' + d.getMilliseconds() + '.json';
            logger.info("uploaded to s3 ", yield s3svc.upload(key, content));
        }
        catch (err) {
            logger.error("error uploading to s3", err, err.stack);
        }
    }));
});
exports.record = record;
/**
 * S3 event handler
 * https://aws.amazon.com/premiumsupport/knowledge-center/lambda-configure-s3-event-notification/
 * see https://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html
 * @param event see https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html
 * @param context see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @param callback callback function
 */
const archive = (event, context, callback) => {
    event.Records.forEach(record => {
        logger.info('Received s3 record:', record);
    });
};
exports.archive = archive;
//# sourceMappingURL=handler.js.map