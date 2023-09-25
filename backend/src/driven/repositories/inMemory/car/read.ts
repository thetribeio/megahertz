import 'reflect-metadata';
import {inject, injectable} from 'tsyringe';
import _ from 'lodash';
import Car from '../../../../core/domain/car/model';
import UnitOfWork from '../common/unitOfWork';
import CarReadRepositoryInterface from '../../../../core/domain/car/interfaces/repositories/read';
import InMemoryCar from './car.entity';
import InMemoryCarRental from '../carRental/carRental.entity';
import CarModel from '../../../../core/domain/carModel/model';
import InMemoryCarModel from '../carModel/carModel.entity';

@injectable()
export default class InMemoryCarReadRepository implements CarReadRepositoryInterface {
    private readonly unitOfWork: UnitOfWork;

    constructor(@inject("UnitOfWork") unitOfWork: UnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    static toCar({inMemoryCar, inMemoryCarModel}:{inMemoryCar: InMemoryCar, inMemoryCarModel: InMemoryCarModel}): Car {
        return new Car({
            id: inMemoryCar.id,
            model: new CarModel({
                id: inMemoryCarModel.id,
                dailyRate: inMemoryCarModel.dailyRate,
            })
        })
    }

    async getOneAvailableCar({modelId, startDate, endDate}: { modelId: string, startDate: Date, endDate: Date }): Promise<Car> {
        const retrievedCars: InMemoryCar[] = _.filter(
            this.unitOfWork.cars,
            inMemoryCar => inMemoryCar.modelId === modelId
        ) as InMemoryCar[];
        const retrievedCarRentals: InMemoryCarRental[] = _.filter(
            this.unitOfWork.carRentals,
            inMemoryCarRental => inMemoryCarRental.modelId === modelId,
        );
        const retrievedCar = _.find(
            retrievedCars,
            inMemoryCar => !(retrievedCarRentals.find((
                element) => (element.carId === inMemoryCar.id) && (element.startDate < endDate) && (element.endDate > startDate)
            ))
        ) as InMemoryCar;
        const retrievedCarModel = _.find(
          this.unitOfWork.carModels,
          inMemoryCarModel => inMemoryCarModel.id === modelId
        ) as InMemoryCarModel;

        return InMemoryCarReadRepository.toCar({
            inMemoryCar: retrievedCar,
            inMemoryCarModel: retrievedCarModel,
        })
    }
}