import { TestingModule } from "@nestjs/testing";
import S3Svc from "../../../src/svc/aws/S3Svc";

import { bootstrap, TestObject } from "../../base.test";

describe("s3 Test", () => {
  const s3Key: string = "tests3objkey";

  let svc: S3Svc;
  let app: TestingModule;

  beforeAll(async () => {
    app = await bootstrap();

    svc = app.get<S3Svc>(S3Svc);

    expect(svc).toBeDefined();
  });

  afterAll(async () => {
    await svc.delete(s3Key);
    app.close();
  });

  it("upload/get", async () => {
    const expected: TestObject = {
      name: "test",
      test: true,
      data: "this is a test",
    };

    const location = await svc.post(
      s3Key,
      Buffer.from(JSON.stringify(expected), "utf-8")
    );
    expect(location).toBeDefined();

    const actual: TestObject = JSON.parse(await svc.get(s3Key));
    expect(actual).toBeDefined();

    expect(actual).toStrictEqual(expected);
  });
});
