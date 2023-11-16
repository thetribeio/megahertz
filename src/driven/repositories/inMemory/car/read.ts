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
import DecodedCursor from "src/core/domain/common/types/cursor";
import {encodeCursor} from "src/core/useCases/common/cursors/encodeDecode";

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

        // EXERCISE #2: MISSING CODE HERE

        return InMemoryCarReadRepository.toCar({
            inMemoryCar: retrievedCar,
            inMemoryCarModel: retrievedCarModel,
        })
    }

    findNextCursor(cars: InMemoryCar[]): string {
        const nextCar = _.find(
            this.unitOfWork.cars,
            inMemoryCar => inMemoryCar.licensePlate > cars[cars.length - 1].licensePlate
        );
        if (nextCar === undefined) {
            return "";
        }

        return nextCar.licensePlate;
    }

    async getCarsPlanning({
                              startDate,
                              endDate,
                              cursor,
                              limit,
                          }: { startDate: Date, endDate: Date, cursor: DecodedCursor, limit: number }): Promise<CarsPlanningDTO> {
        const retrievedCars: InMemoryCar[] = [];
        const sorted = _.orderBy(this.unitOfWork.cars, ['licensePlate'], ['asc']);
        const filtered = _.filter(
            sorted,
            inMemoryCar => cursor.order === 'gte' ? inMemoryCar.licensePlate >= cursor.address : inMemoryCar.licensePlate >= cursor.address
        );
        _.forEach(filtered, (car) => {
            if (retrievedCars.length === limit) {
                return false;
            }
            retrievedCars.push(car);

            return car;
        });
        const planning = {
            cars: {},
            cursor: {
                nextPage: encodeCursor(this.findNextCursor(retrievedCars), cursor.order),
            },
        } as CarsPlanningDTO;
        for (const retrievedCar of retrievedCars) {
            const retrievedCarRentals: InMemoryCarRental[] = _.filter(
                this.unitOfWork.carRentals,
                inMemoryCarRental =>
                    inMemoryCarRental.carId === retrievedCar.id
                    && (
                        (inMemoryCarRental.pickupDateTime >= startDate && inMemoryCarRental.pickupDateTime <= endDate)
                        || (inMemoryCarRental.dropOffDateTime > startDate && inMemoryCarRental.pickupDateTime <= startDate)
                    )
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