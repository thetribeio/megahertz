import {v4} from 'uuid';
import {FactorizedAttrs, Factory} from '@jorgebodega/typeorm-factory';
import {TypeORMCar} from '../../../../../src/driven/repositories/typeorm/entities';
import AppDataSource from '../../../../../src/configuration/database/typeorm/data-source';

export default class TypeORMCarFactory extends Factory<TypeORMCar> {
    protected entity = TypeORMCar;
    protected dataSource = AppDataSource;

    protected attrs(): FactorizedAttrs<TypeORMCar> {
        return {
            id: v4(),
        };
    }
}