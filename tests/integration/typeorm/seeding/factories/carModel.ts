import {container} from 'tsyringe';
import {DataSource} from 'typeorm';
import {v4} from 'uuid';
import {FactorizedAttrs, Factory} from '@jorgebodega/typeorm-factory';
import {TypeORMCarModel} from 'src/driven/repositories/typeorm/entities';

export default class TypeORMCarModelFactory extends Factory<TypeORMCarModel> {
    protected entity = TypeORMCarModel;
    protected dataSource = container.resolve("CommandDataSource") as DataSource;

    protected attrs(): FactorizedAttrs<TypeORMCarModel> {
        return {
            id: v4(),
            dailyRate: 100,
        };
    }
}