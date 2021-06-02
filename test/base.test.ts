import { Test, TestingModule } from "@nestjs/testing";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { AppModule } from "../src/config/app.module";

export interface TestObject {
  name: string;
  test: boolean;
  data: string;
  // need to get proper serializing working of date
  //  timestamp: Date;
}

export async function bootstrap(): Promise<TestingModule> {
  const app: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  expect(app).toBeDefined();

  // And in this case attach a custom logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.enableShutdownHooks();

  await app.init();

  return app;
}
