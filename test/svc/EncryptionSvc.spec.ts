import { TestingModule } from "@nestjs/testing";
import EncryptionSvc from "../../src/svc/EncryptionSvc";
import { bootstrap } from "../base.test";

describe("EncryptionSvc Test", () => {
  let cryptSvc: EncryptionSvc;
  let app: TestingModule;

  beforeAll(async () => {
    app = await bootstrap();

    cryptSvc = app.get<EncryptionSvc>(EncryptionSvc);

    expect(cryptSvc).toBeDefined();
  });

  afterAll(async () => {
    app.close();
  });
  it("encrypt/decrypt", async () => {
    const expected = "666666CP";

    const value = cryptSvc.encrypt(expected);

    console.log(" encrypted [" + value + "]");

    expect(cryptSvc.decrypt(value)).toBe(expected);
  });
});
