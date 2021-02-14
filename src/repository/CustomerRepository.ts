import {EntityRepository , Repository, getManager} from "typeorm";

import Customer from "../entity/Customer";

@EntityRepository(Customer)
export default class CustomerRepository extends Repository<Customer>{

    protected entityManager = getManager();

    // findActiveByPromoUrl = (promoUrl: string, altPromoUrl: string): Promise<User> => {    
    //     return this.entityManager.query('SELECT id, email, promo_catalog_url FROM users where is_active=true and promo_catalog_url in (?,?)', [promoUrl,altPromoUrl]);
    // }
}