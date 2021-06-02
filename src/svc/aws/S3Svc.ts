import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";

import { ManagedUpload } from "aws-sdk/clients/s3";

import BaseAWSSvc from "./BaseAWSSvc";

const defaultConfig: S3.Types.ClientConfiguration = {
  apiVersion: "2006-03-01",
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

    // in localstack need to set both endpoint and s3ForcePathStyle
    // https://github.com/localstack/localstack/issues/3566
    if (this.configService.get<boolean>("aws.localstack")) {
      defaultConfig.s3ForcePathStyle = true;
      defaultConfig.endpoint = this.endpoint;
    }

    if (this.endpoint) {
      defaultConfig.endpoint = this.endpoint;
    }

    this.logger.debug("s3 config " + JSON.stringify(defaultConfig));

    this.s3 = new this.AWS.S3(defaultConfig);
  }

  public post = async (key: string, content: Buffer): Promise<string> => {
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

  public get = async (key: string): Promise<string> => {
    const request: S3.Types.GetObjectRequest = {
      Bucket: this.bucket,
      Key: key,
    };

    this.logger.debug("getting " + JSON.stringify(request));

    const data: S3.Types.GetObjectOutput = await this.s3
      .getObject(request)
      .promise();

    this.logger.debug("got " + JSON.stringify(data));

    return data.Body.toString("utf-8");
  };

  public delete = async (key: string): Promise<void> => {
    const request: S3.Types.DeleteObjectRequest = {
      Bucket: this.bucket,
      Key: key,
    };

    this.logger.debug("deleting " + JSON.stringify(request));

    const data: S3.Types.DeleteObjectOutput = await this.s3
      .deleteObject(request)
      .promise();

    this.logger.debug("deleted " + JSON.stringify(data));
  };
}
