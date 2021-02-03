import AWS = require('aws-sdk');

import { APIGatewayProxyHandler, APIGatewayEvent, Context, Callback, SQSEvent, SQSHandler } from 'aws-lambda';

import winston = require('winston');
import { logConfiguration } from "../config/logging.config";

const logger = winston.createLogger(logConfiguration);

// https://stackoverflow.com/questions/61028751/missing-credentials-in-config-if-using-aws-config-file-set-aws-sdk-load-config
const config = new AWS.Config();
config.credentials = new AWS.Credentials("test","test");
config.region = "us-west-2";

AWS.config.update(config)

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
const sqs = new AWS.SQS();
//TODO externalize SQS endpoint

const baseUlr = 'http://localhost:4566';
const accountId = '000000000000';
const queueName = 'node-101-click';

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
    callback: Callback,
  ): Promise<any> => {
    logger.info('Received api gateway event ', event);

    const params = {
        MessageBody: "clicked",
        QueueUrl: `${baseUlr}/${accountId}/${queueName}`,
        DelaySeconds: 0
    };

    logger.info('posting request to ' + `${baseUlr}/${accountId}/${queueName}`);

    // https://stackoverflow.com/questions/56269829/aws-lambda-finish-before-sending-message-to-sqs
    try {
        await sqs.sendMessage(params).promise(); // since your handler returns a promise, lambda will only resolve after sqs responded with either failure or success
    } catch (err) {
        logger.error('failed to post ' + params, err);
    }
  
    //TODO set cookie
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'echo',
            input: event,
        }),
    };
}

/**
 * SQS event handler
 * awslocal sqs create-queue --queue-name node-101-click
 * see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 * see https://docs.aws.amazon.com/lambda/latest/dg/with-sqs-create-package.html#with-sqs-example-deployment-pkg-nodejs
 * @param event see https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
 * @param context see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @param callback function that will be used to send response
 */
export const record: SQSHandler = async (
    event: SQSEvent,
    context: Context,
    callback: Callback,
  ): Promise<any> => {

    event.Records.forEach(record => {
        logger.info('Received sqs record:', record);
    });

    //TODO insert into collection
    //TODO need to return success or error
    return {};
}