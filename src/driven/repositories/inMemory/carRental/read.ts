import 'reflect-metadata';
import _ from 'lodash';
import {inject, injectable} from 'tsyringe';
import CarRentalReadRepositoryInterface from '../../../../core/domain/carRental/interfaces/repositories/read';
import CarRental from '../../../../core/domain/carRental/model';
import UnitOfWork from '../common/unitOfWork';
import Car from '../../../../core/domain/car/model';
import InMemoryCarRental from './carRental.entity';
import CarModel from '../../../../core/domain/carModel/model';
import InMemoryCarModel from '../carModel/carModel.entity';

@injectable()
export default class InMemoryCarRentalReadRepository implements CarRentalReadRepositoryInterface {
    private readonly unitOfWork: UnitOfWork;

    constructor(@inject("UnitOfWork") unitOfWork: UnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    async read(id: string): Promise<CarRental> {
        // The code below needs be refactored using composition
        // See ticket https://github.com/thetribeio/megahertz/issues/14
        const retrievedCarRental: InMemoryCarRental | undefined = _.find(
            this.unitOfWork.carRentals,
            inMemoryCarRental => inMemoryCarRental.id === id,
        )

        if (retrievedCarRental === undefined) {
            throw Error();
        }

        const retrievedCarModel = _.find(
            this.unitOfWork.carModels,
            inMemoryCarModel => inMemoryCarModel.id === retrievedCarRental.modelId
        ) as InMemoryCarModel;

        return new CarRental({
            id,
            car: new Car({
                id: retrievedCarRental.carId,
                model: new CarModel({
                    id: retrievedCarRental.modelId,
                    dailyRate: retrievedCarModel.dailyRate,
                }),
            }),
            customerId: retrievedCarRental.customerId,
            totalPrice: retrievedCarRental.totalPrice,
            pickupDateTime: retrievedCarRental.pickupDateTime,
            dropOffDateTime: retrievedCarRental.dropOffDateTime,
        });
    }

}