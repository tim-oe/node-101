import { TestingModule } from "@nestjs/testing";
import Customer from "../../../src/entity/Customer";
import CustomerSvc from "../../../src/svc/dao/CustomerSvc";
import { bootstrap } from "../../base.test";

describe("CustomerSvc Test", () => {
  let svc: CustomerSvc;
  let app: TestingModule;

  beforeAll(async () => {
    app = await bootstrap();

    svc = app.get<CustomerSvc>(CustomerSvc);

    expect(svc).toBeDefined();
  });

  afterAll(async () => {
    app.close();
  });
  it("insert/select", async () => {
    const expected: Customer =  new Customer();

    expected.email = "test@example.net";
    expected.password = "pwd";

    expect(await svc.insert(expected)).toBeDefined();

    const actual: Customer = await svc.getUser(expected.id);

    expect(actual).toBeDefined();

    expect(actual.email).toBe(expected.email);
  });
});
