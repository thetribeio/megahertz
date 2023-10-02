import CarRentalReadRepositoryInterface from '../../../../core/domain/carRental/interfaces/repositories/read';
import CarRental from '../../../../core/domain/carRental/model';
import Car from '../../../../core/domain/car/model';
import CarModel from '../../../../core/domain/carModel/model';
import {TypeORMCarRental} from '../entities';
import {inject, singleton} from 'tsyringe';
import {DataSource} from 'typeorm';

@singleton()
export default class TypeORMCarRentalReadRepository implements CarRentalReadRepositoryInterface {

    private readonly dataSource: DataSource;

    constructor(@inject("DataSource") dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    async read(carRentalId: string): Promise<CarRental> {
        const repository = this.dataSource.getRepository(TypeORMCarRental);
        const retrievedCarRental = await repository.findOne({
            where: {id: carRentalId},
            relations: ['customer', 'car', 'car.model']
        }) as TypeORMCarRental;

        return new CarRental({
            id: carRentalId,
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