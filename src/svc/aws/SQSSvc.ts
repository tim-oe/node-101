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

    if(this.baseUrl) {
      defaultConfig.endpoint = this.baseUrl;
    }

    this.logger.debug("sqs config " + JSON.stringify(defaultConfig));

    this.sqs = new AWS.SQS(defaultConfig);
  }

  // https://stackoverflow.com/questions/56269829/aws-lambda-finish-before-sending-message-to-sqs
  // TODO the get url returns localhost even in the lambda
  // https://github.com/localstack/localstack/issues/3562
  protected getQueueUrl = async (): Promise<string> => {
    if (!this.queueUrl) {
      const sqsUrlParams: SQS.Types.GetQueueUrlRequest = {
        QueueName: this.queueName,
      };

      if (this.configService.get<boolean>("aws.localstack")) {
        this.queueUrl = this.baseUrl + this.queueName;
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
      //QueueUrl: ,
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
}
