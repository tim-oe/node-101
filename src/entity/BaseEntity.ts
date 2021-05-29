import { PrimaryGeneratedColumn, Column } from "typeorm";

export default class BaseEntity<T> {
  constructor(properties?: T) {
    if (properties) {
      Object.assign(this, properties);
    }
  }

  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ name: "created_on" })
  createdOn: Date = new Date();

  @Column({ name: "last_updated" })
  lastUpdated: Date = new Date();
}
