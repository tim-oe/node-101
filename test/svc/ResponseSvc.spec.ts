import * as fs from "fs";

import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

import { TestingModule } from "@nestjs/testing";
import ResponseSvc from "../../src/svc/ResponseSvc";
import { bootstrap } from "../base.test";

describe("ResponseSvc Test", () => {
  let svc: ResponseSvc;
  let app: TestingModule;

  beforeAll(async () => {
    app = await bootstrap();

    svc = app.get<ResponseSvc>(ResponseSvc);

    expect(svc).toBeDefined();
  });

  afterAll(async () => {
    app.close();
  });

  it("get response", async () => {
    const json: string = fs.readFileSync(
      "test/data/gateway/event.json",
      "utf8"
    );

    const event: APIGatewayEvent = JSON.parse(json);

    const response: APIGatewayProxyResult = svc.response(event);
    expect(response).toBeDefined();

    expect(response.statusCode).toBe(200);
    expect(response.headers["Set-Cookie"]).toBeDefined();
  });
});
