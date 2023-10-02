import {container} from 'tsyringe';
import {DataSource} from 'typeorm';
import {v4} from 'uuid';
import {FactorizedAttrs, Factory} from '@jorgebodega/typeorm-factory';
import {TypeORMCustomer} from '../../../../../src/driven/repositories/typeorm/entities';


export default class TypeORMCustomerFactory extends Factory<TypeORMCustomer> {
    protected entity = TypeORMCustomer;
    protected dataSource = container.resolve("DataSource") as DataSource;

    protected attrs(): FactorizedAttrs<TypeORMCustomer> {
        return {
            id: v4(),
        };
    }
}