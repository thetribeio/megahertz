import InMemoryCar from '../car/car.entity';

type CarEntries = {
    [key: string]: InMemoryCar,
}

export default class UnitOfWork {
    cars: CarEntries;

    constructor() {
        this.cars = {};
    }
}