import { TestingModule } from "@nestjs/testing";

import SQSSvc from "../../../src/svc/aws/SQSSvc";
import { bootstrap } from "../../base.test";

interface TestMessage {
  name: string;
  test: boolean;
  data: string;
//  timestamp: Date;
}

describe("SQS Test", () => {
  let svc: SQSSvc;
  let app: TestingModule;

  beforeEach(async () => {
    // TODO
  });

  beforeAll(async () => {
    app = await bootstrap();

    svc = app.get<SQSSvc>(SQSSvc);

    expect(svc).toBeDefined();
  });

  afterAll(async () => {
    await svc.purge();
    app.close();
  });
  it("insert/select", async () => {
    const expected: TestMessage = {
      name: "test",
      test: true,
      data: "this is a test",
//      timestamp: new Date(),
    };
    const msgId = await svc.post(JSON.stringify(expected));
    expect(msgId).toBeDefined();

    const actual: TestMessage[] = await svc.get<TestMessage>(1);
    expect(actual).toBeDefined();

    expect(actual[0]).toStrictEqual(expected);
  });
});