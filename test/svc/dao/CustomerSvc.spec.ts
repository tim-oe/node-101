import { TestingModule } from "@nestjs/testing";
import { Connection, getConnection } from "typeorm";
import { TransactionalTestContext } from "typeorm-transactional-tests";

import Customer from "../../../src/entity/Customer";
import CustomerSvc from "../../../src/svc/dao/CustomerSvc";
import { bootstrap } from "../../base.test";

describe("CustomerSvc Test", () => {
  let svc: CustomerSvc;
  let app: TestingModule;

  let connection: Connection;
  let transactionalContext: TransactionalTestContext;

  beforeEach(async () => {
    connection = getConnection();
    transactionalContext = new TransactionalTestContext(connection);
    await transactionalContext.start();
  });

  afterEach(async () => {
    await transactionalContext.finish();
  });

  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalAny: any = global;
    console.log(
      "globalAny.__CONTAINER__\n" + JSON.stringify(globalAny.__CONTAINER__)
    );

    app = await bootstrap();

    svc = app.get<CustomerSvc>(CustomerSvc);

    expect(svc).toBeDefined();
  });

  afterAll(async () => {
    app.close();
  });
  it("insert/select", async () => {
    const expected: Customer = new Customer();

    expected.email = "test@example.net";
    expected.password = "pwd";

    expect(await svc.insert(expected)).toBeDefined();

    const actual: Customer = await svc.getUser(expected.id);

    expect(actual).toBeDefined();

    expect(actual.email).toBe(expected.email);
  });
});
