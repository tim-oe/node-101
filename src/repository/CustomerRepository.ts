import {EntityRepository , Repository, getManager} from "typeorm";

import Customer from "../entity/Customer";

@EntityRepository(Customer)
export default class CustomerRepository extends Repository<Customer>{
    public findById = (id: number): Promise<Customer | undefined> => {    
        return this.findOne({ where: { id: id }});
    }    
}
