import {Entity, PrimaryColumn} from 'typeorm';

@Entity()
export default class TypeORMCustomer {
    @PrimaryColumn()
    public id!: string;
}