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
        const queryRunner = this.dataSource.createQueryRunner("slave");
        return this.dataSource
            .createQueryBuilder(TypeORMCarRental, "car", queryRunner)
            .setQueryRunner(queryRunner);
    }

    async read(id: string): Promise<CarRental> {
        const queryBuilder = await this.queryBuilder();
        const retrievedCarRental = await queryBuilder
            .setFindOptions({where: {id}, relations: ['customer', 'car', 'car.model']})
            .getOne() as TypeORMCarRental;

        return new CarRental({
            id,
            customerId: retrievedCarRental.customer.id,
            totalPrice: retrievedCarRental.totalPrice,
            pickupDateTime: retrievedCarRental.pickupDateTime,
            dropOffDateTime: retrievedCarRental.dropOffDateTime,
            car: new Car({
                id: retrievedCarRental.car.id,
                model: new CarModel({
                    id: retrievedCarRental.car.model.id,
                    dailyRate: retrievedCarRental.car.model.dailyRate,
                })
            })
        })
    }
}