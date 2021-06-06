import { TestingModule } from "@nestjs/testing";

import SQSSvc from "../../../src/svc/aws/SQSSvc";
import { bootstrap, TestObject } from "../../base.test";

describe("SQS Test", () => {
  let svc: SQSSvc;
  let app: TestingModule;

  beforeAll(async () => {
    app = await bootstrap();

    svc = app.get<SQSSvc>(SQSSvc);

    expect(svc).toBeDefined();
  });

  afterAll(async () => {
    await svc.purge();
    app.close();
  });
  it("post/receive", async () => {
    const expected: TestObject = {
      name: "test",
      test: true,
      data: "this is a test",
    };
    const msgId = await svc.post(JSON.stringify(expected));
    expect(msgId).toBeDefined();

    const actual: TestObject[] = await svc.get<TestObject>(1);
    expect(actual).toBeDefined();

    expect(actual[0]).toStrictEqual(expected);
  });
});
