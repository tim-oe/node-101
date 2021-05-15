
import CustomerRepository from '../../repository/CustomerRepository';
import Customer from '../../entity/Customer';
import BaseDaoSvc from './BaseDaoSvc';
import SecretsSvc from '../aws/SecretsSvc';

export default class CustomerSvc extends BaseDaoSvc{

    protected customerRepository!: CustomerRepository;

    public constructor (secretsSvc: SecretsSvc) {
        super(secretsSvc)
    }

    protected  getCustomerRepository =  async (): Promise<CustomerRepository> => { 
 
        if(this.customerRepository == null) {
            this.customerRepository = await this.repository(CustomerRepository);
        }
        
        return this.customerRepository;
    }

    public getUser = async (id: number): Promise<Customer | undefined> => {
        const customerRepository: CustomerRepository = await this.getCustomerRepository();

        return await customerRepository.findOne({id: id});
    }
}