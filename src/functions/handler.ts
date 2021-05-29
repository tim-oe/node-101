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
  S3Handler,
} from "aws-lambda";

import { INestApplicationContext, Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { AppModule } from "../config/app.module";
import SQSSvc from "../svc/aws/SQSSvc";
import CustomerSvc from "../svc/dao/CustomerSvc";
import ResponseSvc from "../svc/ResponseSvc";
import S3Svc from "../svc/aws/S3Svc";

import * as async from "async";

let app: INestApplicationContext;
let logger: Logger;

/**
 * Re-use the application context across function invocations
 * https://dev.to/sebastianschlecht/serverless-nest-js-micro-services-integrations-without-http-ikk
 */
async function bootstrap(): Promise<void> {
  if (!app) {
    app = await NestFactory.createApplicationContext(AppModule, {
      // if a custom logger is supposed to be used, disable the default logger here
      logger: false,
    });

    // And in this case attach a custom logger
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    app.enableShutdownHooks();

    await app.init();
  }

  if (!logger) {
    logger = new Logger("promoo-api-gateway");
  }
}

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callback: Callback
): Promise<APIGatewayProxyResult> => {
  bootstrap();
  logger.debug("Received api gateway event ", JSON.stringify(event));

  const clickQueueSvc: SQSSvc = app.get<SQSSvc>(SQSSvc);
  const customerSvc: CustomerSvc = app.get<CustomerSvc>(CustomerSvc);
  const responseSvc: ResponseSvc = app.get<ResponseSvc>(ResponseSvc);

  try {
    logger.debug(
      "post to sqs success " + (await clickQueueSvc.post(JSON.stringify(event)))
    );

    if (event.pathParameters && event.pathParameters["custid"]) {
      const customer = await customerSvc.getUser(
        parseInt(event.pathParameters["custid"])
      );
      logger.debug("found customer " + JSON.stringify(customer));
    }
  } catch (err) {
    logger.error("error posting to sqs", err.stack);
  }
  return responseSvc.response(event);
};

/**
 * SQS event handler
 * see https://aws.amazon.com/serverless/use-sqs-as-an-event-source-for-lambda-tutorial/
 * @param event see https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html
 * @param context see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @param callback function that will be used to send response
 */
export const record: SQSHandler = async (
  event: SQSEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callback: Callback
): Promise<void> => {
  bootstrap();
  logger.debug("Received sqs event ", JSON.stringify(event));

  const achiveBucketSvc: S3Svc = app.get<S3Svc>(S3Svc);
  await async.eachSeries(event.Records, async function (record: SQSRecord) {
    try {
      const d: Date = new Date();
      const content: Buffer = Buffer.from(JSON.stringify(record.body), "utf-8");
      const key: string = "click-" + d.getMilliseconds() + ".json";

      logger.debug(
        "uploaded to s3 ",
        await achiveBucketSvc.upload(key, content)
      );
    } catch (err) {
      logger.error("error uploading to s3", err.stack);
    }
  });
};

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callback: Callback
): void => {
  bootstrap();
  event.Records.forEach((record) => {
    logger.debug("Received s3 record: " + JSON.stringify(record));
  });
};
