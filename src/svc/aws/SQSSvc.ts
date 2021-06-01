import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";

import { SQS } from "aws-sdk";

import BaseAWSSvc from "./BaseAWSSvc";

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
// https://github.com/localstack/localstack/issues/948
const defaultConfig: SQS.Types.ClientConfiguration = {
  apiVersion: "2012-11-05",
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html

@Injectable()
export default class SQSSvc extends BaseAWSSvc {
  protected sqs!: SQS;
  protected queueName!: string;
  protected queueUrl!: string;

  public constructor(protected configService: ConfigService) {
    super(configService);
    const queueName = configService.get<string>("aws.sqs.queue");
    // https://stackoverflow.com/questions/45194964/how-to-assign-string-undefined-to-string-in-typescript
    if (queueName !== undefined) {
      this.queueName = queueName;
    } else {
      throw Error("queue is not in config");
    }

    if (this.endpoint) {
      defaultConfig.endpoint = this.endpoint;
    }

    this.logger.debug("sqs config " + JSON.stringify(defaultConfig));

    this.sqs = new AWS.SQS(defaultConfig);
  }

  // https://stackoverflow.com/questions/56269829/aws-lambda-finish-before-sending-message-to-sqs
  // https://github.com/localstack/localstack/issues/3562
  protected getQueueUrl = async (): Promise<string> => {
    if (!this.queueUrl) {
      const sqsUrlParams: SQS.Types.GetQueueUrlRequest = {
        QueueName: this.queueName,
      };

      if (this.configService.get<boolean>("aws.localstack")) {
        this.queueUrl = this.endpoint + "000000000000/" + this.queueName;
        this.logger.debug("localstack hackery..." + this.queueUrl);
      } else {
        const queueUrlResult: SQS.Types.GetQueueUrlResult = await this.sqs
          .getQueueUrl(sqsUrlParams)
          .promise();

        if (queueUrlResult.QueueUrl) {
          this.logger.debug("sqs: endpoint " + queueUrlResult.QueueUrl);
          this.queueUrl = queueUrlResult.QueueUrl;
        } else {
          throw Error("failed to get url for " + this.queueName);
        }
      }
    }
    return this.queueUrl;
  };

  public post = async (message: string): Promise<string> => {
    const request: SQS.Types.SendMessageRequest = {
      MessageBody: message,
      QueueUrl: await this.getQueueUrl(),
      DelaySeconds: 0,
    };

    const result: SQS.Types.SendMessageResult = await this.sqs
      .sendMessage(request)
      .promise();

    this.logger.debug("post to sqs success\n" + JSON.stringify(result));

    if (!result.MessageId) {
      throw new Error("failed to post to " + this.queueName + " " + message);
    }

    return result.MessageId;
  };

  public get = async <T>(cnt: number): Promise<T[]> => {
    const request: SQS.Types.ReceiveMessageRequest = {
      QueueUrl: await this.getQueueUrl(),
      MaxNumberOfMessages: cnt,
    };

    const result: SQS.Types.ReceiveMessageResult = await this.sqs
      .receiveMessage(request)
      .promise();

    this.logger.debug("got messages\n" + JSON.stringify(result));

    const msg: T[] = <T[]>{};

    if (result.Messages) {
      for (let index = 0; index < result.Messages.length; index++) {
        msg[index] = JSON.parse(result.Messages[index].Body);
      }
    }

    return msg;
  };

  public purge = async (): Promise<void> => {
    const request: SQS.Types.PurgeQueueRequest = {
      QueueUrl: await this.getQueueUrl(),
    };

    const result = await this.sqs.purgeQueue(request).promise();

    this.logger.debug("purged queue\n" + JSON.stringify(result));
  };
}
