import CarRentalReadRepositoryInterface from 'src/core/domain/carRental/interfaces/repositories/read';
import CarRental from 'src/core/domain/carRental/model';
import Car from 'src/core/domain/car/model';
import CarModel from 'src/core/domain/carModel/model';
import {TypeORMCarRental} from '../entities';
import {inject, singleton} from 'tsyringe';
import {DataSource} from 'typeorm';

@singleton()
export default class TypeORMCarRentalReadRepository implements CarRentalReadRepositoryInterface {

    private readonly dataSource: DataSource;

    constructor(@inject("QueryDataSource") dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    async read(id: string): Promise<CarRental> {
        const repository = this.dataSource.getRepository(TypeORMCarRental);
        const retrievedCarRental = await repository.findOne({
            where: {id},
            relations: ['customer', 'car', 'car.model']
        }) as TypeORMCarRental;

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