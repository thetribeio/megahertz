import 'reflect-metadata';
import {singleton} from 'tsyringe';
import InMemoryCar from '../car/car.entity';
import InMemoryCarRental from '../carRental/carRental.entity';
import InMemoryCarModel from '../carModel/carModel.entity';

@singleton()
export default class UnitOfWork {
    cars: InMemoryCar[];

    carRentals: InMemoryCarRental[];

    carModels: InMemoryCarModel[];

    constructor() {
        this.cars = [];
        this.carRentals = [];
        this.carModels = [];
    }
}