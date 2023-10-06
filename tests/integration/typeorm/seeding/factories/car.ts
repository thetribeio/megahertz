import {container} from 'tsyringe';
import {DataSource} from 'typeorm';
import {v4} from 'uuid';
import {FactorizedAttrs, Factory} from '@jorgebodega/typeorm-factory';
import {TypeORMCar} from 'src/driven/repositories/typeorm/entities';

export default class TypeORMCarFactory extends Factory<TypeORMCar> {
    protected entity = TypeORMCar;
    protected dataSource = container.resolve("DataSource") as DataSource;

    protected attrs(): FactorizedAttrs<TypeORMCar> {
        return {
            id: v4(),
        };
    }
}