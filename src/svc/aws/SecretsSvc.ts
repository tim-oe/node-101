import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SecretsManager } from "aws-sdk";

import BaseAWSSvc from "./BaseAWSSvc";

const defaultConfig: SecretsManager.Types.ClientConfiguration = {
  apiVersion: "2017-10-17",
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html
@Injectable()
export default class SecretsSvc extends BaseAWSSvc {
  protected secretsmanager!: SecretsManager;

  public constructor(protected configService: ConfigService) {
    super(configService);

    if(this.baseUrl) {
      defaultConfig.endpoint = this.baseUrl;
    }

    this.logger.debug("secrets config " + JSON.stringify(defaultConfig));

    this.secretsmanager = new this.AWS.SecretsManager(defaultConfig);
  }

  public get = async (id: string): Promise<string> => {
    try {
      const request: SecretsManager.Types.GetSecretValueRequest = {
        SecretId: id,
      };

      const resp: SecretsManager.Types.GetSecretValueResponse =
        await this.secretsmanager.getSecretValue(request).promise();

      if (resp && resp.SecretString) {
        this.logger.debug("got secret: " + id);
        return resp.SecretString;
      } else {
        throw new Error("no data returned for secret " + id);
      }
    } catch (err) {
      this.logger.error("failed to get secret " + id + '\n' + JSON.stringify(err), err.stack);
      throw new Error("failed to get secret " + id);
    }
  };
}
