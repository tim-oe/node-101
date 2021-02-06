import async = require("async");

import AWS = require('aws-sdk');

import { SQS, S3 } from 'aws-sdk';

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

import { APIGatewayProxyResultV2 } from "../bean/APIGatewayProxyResultV2";

import winston = require('winston');
import { Logger } from 'winston';
import { logConfiguration } from "../config/logging.config";
import { ManagedUpload } from 'aws-sdk/clients/s3';

const logger: Logger = winston.createLogger(logConfiguration);

// https://stackoverflow.com/questions/61028751/missing-credentials-in-config-if-using-aws-config-file-set-aws-sdk-load-config
// TODO this should not be needed
const config: AWS.Config = new AWS.Config();
config.credentials = new AWS.Credentials(
    "test",
    "test"
);
config.region = "us-west-2";

// need to set creds before creating sqs client
// https://stackoverflow.com/questions/56152697/could-not-load-credentials-from-any-providers-when-attempting-upload-to-aws-s3
AWS.config.update(config)

//TODO should be able to get the url based on name or arn...
// https://github.com/localstack/localstack/issues/3068
const baseUlr: string = 'http://' + process.env.LOCALSTACK_HOSTNAME + ':4566';
const accountId = '000000000000';
const queueName = 'node-101-click';

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
// https://github.com/localstack/localstack/issues/948
const sqsConfig: SQS.Types.ClientConfiguration = {
    endpoint: baseUlr,
    apiVersion: '2012-11-05'
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
const sqs: AWS.SQS = new AWS.SQS(sqsConfig);

const s3Config: S3.Types.ClientConfiguration = {
    endpoint: baseUlr,
    apiVersion: '2006-03-01'
}

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
const s3: AWS.S3 = new AWS.S3(s3Config);

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
): Promise<APIGatewayProxyResult> => {
    logger.info('Received api gateway event ', event);

    // https://stackoverflow.com/questions/56269829/aws-lambda-finish-before-sending-message-to-sqs
    try {
        const sqsUrlParams: SQS.Types.GetQueueUrlRequest = {
            QueueName: queueName,
            QueueOwnerAWSAccountId: accountId
        };

        const queueUrlResult: SQS.Types.GetQueueUrlResult = await sqs.getQueueUrl(sqsUrlParams).promise(); // since your handler returns a promise, lambda will only resolve after sqs responded with either failure or success

        if (queueUrlResult.QueueUrl) {
            logger.info('sqs: endpoint ' + queueUrlResult.QueueUrl);

            const request: SQS.Types.SendMessageRequest = {
                MessageBody: JSON.stringify(event),
                //QueueUrl: queueUrlResult.QueueUrl,
                QueueUrl: `${baseUlr}/${accountId}/${queueName}`,
                DelaySeconds: 0
            };

            const result: SQS.Types.SendMessageResult = await sqs.sendMessage(request).promise(); // since your handler returns a promise, lambda will only resolve after sqs responded with either failure or success

            logger.info('post to sqs success', result);
        } else {
            logger.info('failed to get endpoint for ' + queueName);
        }
    } catch (err) {
        logger.error('failed to post to sqs', err);
    }

    const resp: APIGatewayProxyResultV2 = {
        statusCode: 200,
        body: JSON.stringify(event),
        // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
        // https://stackoverflow.com/questions/43190935/setting-http-response-header-from-aws-lambda#43194717
        // https://en.wikipedia.org/wiki/HTTP_cookie#Expires_and_Max-Age
        //         cookies: ["mycookie=chocolateChip; Max-Age=15552000"
        // //            ,acookie=fudgestripes; Expires="
        //         ],
        headers: {
            "Set-Cookie": "mycookie=chocolateChip; Max-Age=15552000"
        }
    };

    return resp;
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
    callback: Callback,
): Promise<void> => {
    logger.info('Received sqs event ', event);

    const record: SQSRecord = event.Records[0];

    const d: Date = new Date();
    const request: S3.Types.PutObjectRequest = {
        Bucket: "node-101-archive",
        Body: Buffer.from(JSON.stringify(record.body), "utf-8"),
        Key: 'click-' + d.getMilliseconds() + '.json'
    };

    try {
        logger.info("uploading to s3 " + request.Key);
        const data: ManagedUpload.SendData = await s3.upload(request).promise();
        logger.info("uploaded to s3", data);
    } catch (err) {
        logger.error("error uploading to s3", err, err.stack);
    }
}

/**
 * S3 event handler
 * see https://docs.aws.amazon.com/AmazonS3/latest/dev/notification-content-structure.html
 * @param event see https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html
 * @param context see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @param callback function that will be used to send response
 */
export const archive: S3Handler = async (
    event: S3Event,
    context: Context,
    callback: Callback,
): Promise<void> => {
    event.Records.forEach(record => {
        logger.info('Received s3 record:', JSON.stringify(record));
    });
}