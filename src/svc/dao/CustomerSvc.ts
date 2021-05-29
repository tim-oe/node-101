import Customer from "../../entity/Customer";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export default class CustomerSvc {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectRepository(Customer)
    protected repo: Repository<Customer>
  ) {}

  public getUser = async (id: number): Promise<Customer | undefined> => {
    return await this.repo.findOne({ where: { id: id } });
  };

  public insert = async (customer: Customer): Promise<Customer | undefined> => {
    return await this.repo.save(customer);
  };
}
