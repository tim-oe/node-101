
import async = require("async");

import {
    APIGatewayProxyHandler,
    APIGatewayEvent,
    APIGatewayProxyResult,
    Context,
    Callback,
    SQSEvent,
    SQSRecord,
    SQSHandler,
    S3Event,
    S3Handler
} from 'aws-lambda';

import { 
    customerSvc, 
    responseSvc, 
    achiveBucketSvc, 
    clickQueueSvc 
} from "../config/app.config";

import winston = require('winston');
import { Logger } from 'winston';
import { logConfiguration } from "../config/logging.config";

const logger: Logger = winston.createLogger(logConfiguration);

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
    event: APIGatewayEvent,
    context: Context,
    callback: Callback
): Promise<APIGatewayProxyResult> => {
    logger.info('Received api gateway event ', event);
    try {
        logger.info('post to sqs success ' + await clickQueueSvc().post(JSON.stringify(event)));
        
        if(event.pathParameters && event.pathParameters['custid']) {
            const customer = await customerSvc().getUser(parseInt(event.pathParameters['custid']))
            logger.info('found customer', customer);
        }
    } catch (err) {
        logger.error("error posting to sqs", err);
    }
    return responseSvc().response(event);
}

/**
 * SQS event handler
 * see https://aws.amazon.com/serverless/use-sqs-as-an-event-source-for-lambda-tutorial/
 * @param event see https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
 * @param context see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @param callback function that will be used to send response
 */
export const record: SQSHandler = async (
    event: SQSEvent,
    context: Context,
    callback: Callback
): Promise<void> => {
    logger.info('Received sqs event', event);
    await async.eachSeries(event.Records, async function(record: SQSRecord) {
        try {
            const d: Date = new Date();
            const content: Buffer = Buffer.from(JSON.stringify(record.body), "utf-8");
            const key: string = 'click-' + d.getMilliseconds() + '.json';
    
            logger.info("uploaded to s3 ", await achiveBucketSvc().upload(key, content));
        } catch (err) {
            logger.error("error uploading to s3", err);
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
    callback: Callback
): void => {
    event.Records.forEach(record => {
        logger.info('Received s3 record:', record);
    });
}