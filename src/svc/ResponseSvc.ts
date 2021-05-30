import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CookieSerializeOptions } from "cookie";

//1 year
const MAX_AGE: number = 60 * 60 * 24 * 365;

@Injectable()
export default class ResponseSvc {
  protected readonly logger = new Logger(this.constructor.name);

  protected cookie = require("cookie");

  public constructor(protected configService: ConfigService) {}

  public response = (event: APIGatewayProxyEvent): APIGatewayProxyResult => {
    // https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
    // https://stackoverflow.com/questions/43190935/setting-http-response-header-from-aws-lambda#43194717
    // https://en.wikipedia.org/wiki/HTTP_cookie#Expires_and_Max-Age
    const expiry: Date = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    const cookieConfig: CookieSerializeOptions = {
      maxAge: MAX_AGE,
      expires: expiry,
    };

    const myCookie: string = this.cookie.serialize(
      this.configService.get("cookie", "failed"),
      "chocolateChip",
      cookieConfig
    );

    const resp: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify(event),
      headers: {
        "Set-Cookie": myCookie,
      },
    };

    return resp;
  };
}
