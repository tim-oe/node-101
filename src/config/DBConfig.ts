import config from "config";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

const dbConfig: MysqlConnectionOptions = config.get('db');

const typeOrmConfig: MysqlConnectionOptions = {
    name: "default",
    type: dbConfig.type,
    host: dbConfig.host,
    port: dbConfig.port ? dbConfig.port : 3306,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    synchronize: false,
    logging: dbConfig.logging ? dbConfig.logging : true,
    entities: [__dirname + '/../entity/**/*.{js,ts}'],
}

export { typeOrmConfig }