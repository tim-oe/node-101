import winston = require('winston');
import { Logger } from 'winston';
import { logConfiguration } from "../../config/logging.config";

import {Connection, createConnection, ObjectType} from "typeorm";

import SecretsSvc from '../aws/SecretsSvc';

import typeOrmConfig from '../../config/typeorm.config';

export default class BaseDaoSvc {

    protected logger = winston.createLogger(logConfiguration);

    protected conn!: Connection;

    protected repository = async <T>(repo: ObjectType<T>): Promise<T> => {
        if(!this.conn) {
            this.conn = await createConnection(await typeOrmConfig())
        }
        return this.conn.getCustomRepository(repo);
    }
}
