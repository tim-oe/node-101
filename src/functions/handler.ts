import AWS = require('aws-sdk');

import { APIGatewayProxyHandler, APIGatewayEvent, Context, Callback, SQSEvent, SQSHandler } from 'aws-lambda';

import winston = require('winston');
import { logConfiguration } from "../config/logging.config";

const logger = winston.createLogger(logConfiguration);

const sqs = new AWS.SQS();
//TODO externalize SQS endpoint
// Set the region we will be using
AWS.config.update({ region: 'us-west-2' });
const baseUlr = 'http://localhost:4566';
const accountId = '000000000000';
const queueName = 'click';

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
//module.exports.echo = (event, context, callback) => {

    logger.info('Received api gateway event:', JSON.stringify(event, null, 2));

    // const params = {
    //     MessageBody: JSON.stringify(event),
    //     QueueUrl: `${baseUlr}/${accountId}/${queueName}`
    // };

    // sqs.sendMessage(params, (err, data) => {
    //     if (err) {
    //         logger.error('failed to post ' + JSON.stringify(data, null, 2), err);
    //     }
    // });

    //TODO set cookie
    return {
        statusCode: 444,
        body: JSON.stringify({
            message: 'echo',
            input: event,
        }),
    };

    //callback(null, response);
}

/**
 * SQS event handler
 * awslocal sqs create-queue --queue-name click
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
//module.exports.record = async (event, context, callback) => {

    event.Records.forEach(record => {
        logger.info('Received sqs record:', JSON.stringify(record, null, 2));
    });

    //TODO insert into collection
    //TODO need to return success or error
    return {};
}