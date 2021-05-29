import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";

import { ManagedUpload } from "aws-sdk/clients/s3";

import BaseAWSSvc from "./BaseAWSSvc";

// in localstack need to set both endpoint and s3ForcePathStyle
// https://github.com/localstack/localstack/issues/3566
const defaultConfig: S3.Types.ClientConfiguration = {
  apiVersion: "2006-03-01",
  s3ForcePathStyle: true,
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
@Injectable()
export default class S3Svc extends BaseAWSSvc {
  protected s3: S3;
  protected bucket: string;
  public constructor(protected configService: ConfigService) {
    super(configService);

    const bucket = configService.get<string>("aws.s3.bucket");
    if (bucket !== undefined) {
      this.bucket = bucket;
    } else {
      throw Error("bucket name is not in config");
    }

    if(this.baseUrl) {
      defaultConfig.endpoint = this.baseUrl;
    }

    this.logger.debug("s3 config " + JSON.stringify(defaultConfig));

    this.s3 = new this.AWS.S3(defaultConfig);
  }

  public upload = async (key: string, content: Buffer): Promise<string> => {
    const request: S3.Types.PutObjectRequest = {
      Bucket: this.bucket,
      Body: content,
      Key: key,
    };

    this.logger.debug("uploading " + this.bucket + ":" + request.Key);
    const data: ManagedUpload.SendData = await this.s3
      .upload(request)
      .promise();
    this.logger.debug("uploaded to s3 " + JSON.stringify(data));

    return data.Location;
  };
}
