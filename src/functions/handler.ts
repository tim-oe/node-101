import config = require('config');

import AWS, { SQS, S3 } from 'aws-sdk';
import {
    APIGatewayProxyHandler,
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context,
    Callback,
    SQSEvent,
    SQSHandler,
    S3Event,
    S3Handler
} from 'aws-lambda';

import SQSSvc from "../svc/aws/SQSSvc";
import S3Svc  from "../svc/aws/S3Svc";

import winston = require('winston');
import { Logger } from 'winston';
import { logConfiguration } from "../config/logging.config";
import ResponseSvc from '../svc/ResponseSvc';

const logger: Logger = winston.createLogger(logConfiguration);

//TODO should be able to get the url based on name or arn...
// https://github.com/localstack/localstack/issues/3068
const baseUlr: string = 'http://' + process.env.LOCALSTACK_HOSTNAME + ':4566';

// https://stackoverflow.com/questions/61028751/missing-credentials-in-config-if-using-aws-config-file-set-aws-sdk-load-config
// TODO this should not be needed
const awsConfig: AWS.Config = new AWS.Config();
awsConfig.credentials = new AWS.Credentials(
    "test",
    "test"
);
awsConfig.region = config.get('aws.region');

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
// https://github.com/localstack/localstack/issues/948
const sqsConfig: SQS.Types.ClientConfiguration = {
    endpoint: baseUlr,
    apiVersion: '2012-11-05'
};

const sqsSvc: SQSSvc = new SQSSvc(config.get('sqs.queue'), awsConfig, sqsConfig);

// in localstack need to set both endpoint and s3ForcePathStyle
// https://github.com/localstack/localstack/issues/3566
const s3Config: S3.Types.ClientConfiguration = {
    endpoint: baseUlr,
    apiVersion: '2006-03-01',
    s3ForcePathStyle: true
};

const s3svc: S3Svc = new S3Svc(config.get('sqs.queue'), awsConfig, s3Config);

const responseSvc: ResponseSvc = new ResponseSvc();

/**
 * API Gateway event handler
 * awslocal apigateway create-rest-api --name click
 * see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 * types gleened from https://github.com/saybou/serverless-typescript-aws/blob/master/handler.ts
 * @param event see https://github.com/awsdocs/aws-lambda-developer-guide/blob/master/sample-apps/nodejs-apig/event.json
 * @param context see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @param callback function that will be used to send response
 */
export const echo: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback,
): Promise<APIGatewayProxyResult> => {
    logger.info('Received api gateway event ', event);
    logger.info('post to sqs success', sqsSvc.post(JSON.stringify(event)));
    return responseSvc.response(event);
}

/**
 * SQS event handler
 * see https://aws.amazon.com/serverless/use-sqs-as-an-event-source-for-lambda-tutorial/
 * @param event see https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
 * @param context see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @param callback function that will be used to send response
 */
export const record: SQSHandler =  (
    event: SQSEvent,
    context: Context,
    callback: Callback,
): void => {
    logger.info('Received sqs event', event);
    event.Records.forEach(record => {
        try {
            const d: Date = new Date();
            const content: Buffer = Buffer.from(JSON.stringify(record.body), "utf-8");
            const key: string = 'click-' + d.getMilliseconds() + '.json';
    
            logger.info("uploaded to s3 " + s3svc.upload(key, content));
        } catch (err) {
            logger.error("error uploading to s3", err, err.stack);
        }
    }); 
}

/**
 * S3 event handler
 * https://aws.amazon.com/premiumsupport/knowledge-center/lambda-configure-s3-event-notification/
 * see https://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html
 * @param event see https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html
 * @param context see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @param callback callback function
 */
export const archive: S3Handler = (
    event: S3Event,
    context: Context,
    callback: Callback,
): void => {
    event.Records.forEach(record => {
        logger.info('Received s3 record:', record);
    });
}