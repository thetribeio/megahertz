import {v4} from 'uuid';
import {FactorizedAttrs, Factory} from '@jorgebodega/typeorm-factory';
import {TypeORMCustomer} from '../../../../../src/driven/repositories/typeorm/entities';
import AppDataSource from '../../../../../src/configuration/database/typeorm/data-source';

export default class TypeORMCustomerFactory extends Factory<TypeORMCustomer> {
    protected entity = TypeORMCustomer;
    protected dataSource = AppDataSource;

    protected attrs(): FactorizedAttrs<TypeORMCustomer> {
        return {
            id: v4(),
        };
    }
}