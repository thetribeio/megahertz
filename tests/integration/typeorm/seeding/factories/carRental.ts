import {container} from 'tsyringe';
import {DataSource} from 'typeorm';
import {v4} from 'uuid';
import {FactorizedAttrs, Factory} from '@jorgebodega/typeorm-factory';
import {TypeORMCar, TypeORMCarRental, TypeORMCustomer} from 'src/driven/repositories/typeorm/entities';

export default class TypeORMCarRentalFactory extends Factory<TypeORMCarRental> {
    protected entity = TypeORMCarRental;
    protected dataSource = container.resolve("DataSource") as DataSource;

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