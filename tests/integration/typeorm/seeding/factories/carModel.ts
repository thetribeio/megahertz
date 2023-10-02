import {v4} from 'uuid';
import {FactorizedAttrs, Factory} from '@jorgebodega/typeorm-factory';
import {TypeORMCarModel} from '../../../../../src/driven/repositories/typeorm/entities';
import AppDataSource from '../../../../../src/configuration/database/typeorm/data-source';

export default class TypeORMCarModelFactory extends Factory<TypeORMCarModel> {
    protected entity = TypeORMCarModel;
    protected dataSource = AppDataSource;

    protected attrs(): FactorizedAttrs<TypeORMCarModel> {
        return {
            id: v4(),
            dailyRate: 100,
        };
    }
}