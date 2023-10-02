import {v4} from 'uuid';
import {FactorizedAttrs, Factory} from '@jorgebodega/typeorm-factory';
import {TypeORMCar, TypeORMCarRental, TypeORMCustomer} from '../../../../../src/driven/repositories/typeorm/entities';
import AppDataSource from '../../../../../src/configuration/database/typeorm/data-source';

export default class TypeORMCarRentalFactory extends Factory<TypeORMCarRental> {
    protected entity = TypeORMCarRental;
    protected dataSource = AppDataSource;

    protected attrs(): FactorizedAttrs<TypeORMCarRental> {
        return {
            id: v4(),
            totalPrice: 0,
            pickupDateTime: new Date(),
            dropOffDateTime: new Date(),
            customer: new TypeORMCustomer(),
            car: new TypeORMCar(),
        };
    }
}