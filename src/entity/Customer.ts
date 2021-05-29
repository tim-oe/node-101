import { Entity, Column } from "typeorm";

import BaseEntity from "./BaseEntity";

@Entity({ name: "customer" })
export default class Customer extends BaseEntity<Customer> {
  @Column({ name: "email", length: 64, nullable: false })
  email!: string;

  @Column({ name: "password", length: 64 })
  password!: string;

  @Column({ name: "enabled", nullable: false })
  enabled: boolean = true;
}
