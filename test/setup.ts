import { DockerComposeEnvironment, Wait } from "testcontainers";

import * as path from "path";

import * as child_process from "child_process";

/**
 * https://jestjs.io/docs/configuration#globalsetup-string
 * https://www.npmjs.com/package/testcontainers
 * get the the enviroment for localstack
 * create the test container
 */
module.exports = async () => {
  console.log("\nglobal setup called\n");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globalAny: any = global;

  const composeFilePath = path.resolve(__dirname, "..");
  const composeFile = "docker-compose.yml";

  const localstackEnv: DockerComposeEnvironment = new DockerComposeEnvironment(
    composeFilePath,
    composeFile
  )
    .withWaitStrategy(
      "localstack",
      Wait.forLogMessage(
        "lambda_executors: Checking if there are idle containers"
      )
    )
    .withWaitStrategy(
      "db",
      Wait.forLogMessage("mysqld: ready for connections")
    );

  console.log("launching docker container...\n");

  globalAny.__CONTAINER__ = await localstackEnv.up();

  console.log("init mysql...\n");

  const out: Buffer = child_process.execSync("gradle dbReset");

  console.log(out.toString("utf8") + "\n");

  console.log("setup complete\n");
};
