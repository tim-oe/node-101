import * as fs from "fs";

import * as yaml from "js-yaml";
import { join } from "path";

const ENV = process.env.NODE_ENV;

const DEFAULT_FILENAME = "/../../config/default.yml";

const CONFIG_FILENAME = "/../../config/" + ENV + ".yml";
export default (): Record<string, unknown> => {
  const configFile = join(__dirname, CONFIG_FILENAME);

  //console.log("env " + JSON.stringify(process.env));

  if (fs.existsSync(configFile)) {
    return yaml.load(fs.readFileSync(configFile, "utf8")) as Record<
      string,
      unknown
    >;
  } else {
    const defFile = join(__dirname, DEFAULT_FILENAME);
    if (fs.existsSync(configFile)) {
      console.log(configFile + " doesnt exis't loading " + defFile);
      return yaml.load(
        fs.readFileSync(join(__dirname, DEFAULT_FILENAME), "utf8")
      ) as Record<string, unknown>;
    } else {
      throw new Error(
        "missing config file " + configFile + " and default " + defFile
      );
    }
  }
};
