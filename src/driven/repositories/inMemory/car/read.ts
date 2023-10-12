import 'reflect-metadata';
import {inject, injectable} from 'tsyringe';
import _ from 'lodash';
import Car from 'src/core/domain/car/model';
import UnitOfWork from '../common/unitOfWork';
import CarReadRepositoryInterface from 'src/core/domain/car/interfaces/repositories/read';
import InMemoryCar from './car.entity';
import InMemoryCarRental from '../carRental/carRental.entity';
import CarModel from 'src/core/domain/carModel/model';
import InMemoryCarModel from '../carModel/carModel.entity';
import UnavailableCarError from 'src/core/domain/car/errors/unavailable';
import CarsPlanningDTO from "src/core/domain/car/outputBoundaries/outputBoundary";

@injectable()
export default class InMemoryCarReadRepository implements CarReadRepositoryInterface {
    private readonly unitOfWork: UnitOfWork;

    constructor(@inject("UnitOfWork") unitOfWork: UnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    /**
     * Maps an in memory car to an instance of domain model Car.
     *
     * @param inMemoryCar The in memory car to use for mapping.
     * @param inMemoryCarModel The in memory car model to use for mapping.
     */
    static toCar({
                     inMemoryCar,
                     inMemoryCarModel
                 }: { inMemoryCar: InMemoryCar, inMemoryCarModel: InMemoryCarModel }): Car {
        return new Car({
            id: inMemoryCar.id,
            model: new CarModel({
                id: inMemoryCarModel.id,
                dailyRate: inMemoryCarModel.dailyRate,
            })
        })
    }

    async getOneAvailableCar({
                                 modelId,
                                 pickupDateTime,
                                 dropOffDateTime
                             }: { modelId: string, pickupDateTime: Date, dropOffDateTime: Date }): Promise<Car> {
        // The code below needs be refactored using composition
        // See ticket https://github.com/thetribeio/megahertz/issues/14
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
                element) => (element.carId === inMemoryCar.id) && (element.pickupDateTime < dropOffDateTime) && (element.dropOffDateTime > pickupDateTime)
            ))
        );
        if (retrievedCar === undefined) {
            throw new UnavailableCarError();
        }
        const retrievedCarModel = _.find(
            this.unitOfWork.carModels,
            inMemoryCarModel => inMemoryCarModel.id === modelId
        ) as InMemoryCarModel;

        return InMemoryCarReadRepository.toCar({
            inMemoryCar: retrievedCar,
            inMemoryCarModel: retrievedCarModel,
        })
    }

    async getCarsPlanning(): Promise<CarsPlanningDTO> {
        const retrievedCars = this.unitOfWork.cars as InMemoryCar[];
        const planning = {
            cars: {}
        } as CarsPlanningDTO;
        for (const retrievedCar of retrievedCars) {
            const retrievedCarRentals: InMemoryCarRental[] = _.filter(
                this.unitOfWork.carRentals,
                inMemoryCarRental => inMemoryCarRental.carId === retrievedCar.id,
            );
            planning.cars[retrievedCar.id] = {
                rentals: []
            }
            for (const retrievedCarRental of retrievedCarRentals) {
                planning.cars[retrievedCar.id].rentals.push({
                    id: retrievedCarRental.id,
                    pickupDateTime: retrievedCarRental.pickupDateTime,
                    dropOffDateTime: retrievedCarRental.dropOffDateTime,
                })
            }
        }

        return planning;
    }
}