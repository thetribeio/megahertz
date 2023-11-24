import CarRentalReadRepositoryInterface from 'src/core/domain/carRental/interfaces/repositories/read';
import CarRental from 'src/core/domain/carRental/model';
import Car from 'src/core/domain/car/model';
import CarModel from 'src/core/domain/carModel/model';
import {TypeORMCarRental} from '../entities';
import {inject, singleton} from 'tsyringe';
import {DataSource, SelectQueryBuilder} from 'typeorm';

@singleton()
export default class TypeORMCarRentalReadRepository implements CarRentalReadRepositoryInterface {

    private readonly dataSource: DataSource;

    constructor(@inject("DataSource") dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    private async queryBuilder(): Promise<SelectQueryBuilder<TypeORMCarRental>> {
        // EXERCISE #3: MISSING CODE HERE
    }

    async read(id: string): Promise<CarRental> {
        const queryBuilder = await this.queryBuilder();
        // EXERCISE #3: MISSING CODE HERE
    }
}