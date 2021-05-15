import config from "config";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import SecretsSvc from "../svc/aws/SecretsSvc";
import { secretsSvc } from "./app.config";

interface DBConfig extends MysqlConnectionOptions {
    secretId: string;
}

interface DBCredentials {
    username: string;
    password: string;
}

let toc: MysqlConnectionOptions;
export default async function typeOrmConfig(
): Promise<MysqlConnectionOptions> {

    if (!toc) {
        const dbConfig: DBConfig = config.get('db');

        const creds: DBCredentials = JSON.parse(await secretsSvc().get(dbConfig.secretId));

        toc = {
            name: "default",
            type: dbConfig.type,
            host: dbConfig.host,
            port: dbConfig.port ? dbConfig.port : 3306,
            username: creds.username,
            password: creds.password,
            database: dbConfig.database,
            synchronize: false,
            logging: dbConfig.logging ? dbConfig.logging : true,
            entities: [__dirname + '/../entity/**/*.{js,ts}'],
        };
    }
    return toc;
}
