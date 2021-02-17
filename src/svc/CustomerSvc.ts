import winston = require('winston');
import { Logger } from 'winston';
import { logConfiguration } from "../config/logging.config";

import {Connection, createConnection} from "typeorm";

import { typeOrmConfig } from '../config/DBConfig'
import CustomerRepository from '../repository/CustomerRepository';
import Customer from '../entity/Customer';

export default class CustomerSvc {

    protected logger = winston.createLogger(logConfiguration);

    protected conn!: Connection;
    protected customerRepository!: CustomerRepository;

    protected  getCustomerRepository =  async (): Promise<CustomerRepository> => { 
 
        if(this.conn == null) {
            this.conn =  await createConnection(typeOrmConfig)
            this.customerRepository = this.conn.getCustomRepository(CustomerRepository);
        }
        
        return this.customerRepository;
    }

    public getUser = async (id: number): Promise<Customer | undefined> => {
        const customerRepository: CustomerRepository = await this.getCustomerRepository();

        return await customerRepository.findOne({id: id});
    }
}