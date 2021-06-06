import { StartedDockerComposeEnvironment } from "testcontainers";

/**
 * https://jestjs.io/docs/configuration#globalteardown-string
 */
module.exports = async function () {
  console.log("\nglobal tear down called\n");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalAny: any = global;

  console.log("shutting down docker container\n");
  const localstackEnv: StartedDockerComposeEnvironment =
    globalAny.__CONTAINER__;
  await (await localstackEnv.stop()).down();

  console.log("global tear down complete\n");
};
