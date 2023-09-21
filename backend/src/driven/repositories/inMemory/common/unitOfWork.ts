import 'reflect-metadata';
import {singleton} from 'tsyringe';
import InMemoryCar from '../car/car.entity';

@singleton()
export default class UnitOfWork {
    cars: InMemoryCar[];

    constructor() {
        this.cars = [];
    }
}