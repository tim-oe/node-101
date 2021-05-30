import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import * as AWS from "aws-sdk";
import { Config, Credentials } from "aws-sdk";

export default abstract class BaseAWSSvc {
  protected readonly logger = new Logger(this.constructor.name);

  protected endpoint!: string;

  //TODO why this can't use * import???
  protected AWS = require("aws-sdk");

  public constructor(protected configService: ConfigService) {
    const config: Config = new Config();

    // localstack isn't reading creds from config file
    // https://stackoverflow.com/questions/56152697/could-not-load-credentials-from-any-providers-when-attempting-upload-to-aws-s3
    if (this.configService.get<boolean>("aws.localstack")) {
      this.endpoint =
        "http://" + process.env.LOCALSTACK_HOSTNAME + ":4566/";
      config.credentials = new Credentials("localstack", "localstack");
    }

    const endpoint = this.configService.get<string>("aws.endpoint");

    if (endpoint) {
      this.endpoint = endpoint;
    }

    config.region = this.configService.get("aws.region");

    this.logger.debug("aws config " + JSON.stringify(config));

    AWS.config.update(config);
  }
}
