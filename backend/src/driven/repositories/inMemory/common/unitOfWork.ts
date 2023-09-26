import 'reflect-metadata';
import {inject, singleton} from 'tsyringe';
import InMemoryCar from '../car/car.entity';
import InMemoryCarRental from '../carRental/carRental.entity';
import InMemoryCarModel from '../carModel/carModel.entity';
import UnitOfWorkMemento from './memento';
import deepClone from 'deep-clone';

export type UnitOfWorkReplica = {
    state: number;

    cars: InMemoryCar[];

    carRentals: InMemoryCarRental[];

    carModels: InMemoryCarModel[];
}

export interface UnitOfWorkOriginatorInterface {
    save(): Promise<UnitOfWorkMemento>;

    saveEntity(name: string, entity: any): Promise<void>;

    syncSave(): UnitOfWorkMemento;

    restore(memento: UnitOfWorkMemento): void;
}

@singleton()
export default class UnitOfWork implements UnitOfWorkOriginatorInterface {
    private state: number;

    cars: InMemoryCar[];

    carRentals: InMemoryCarRental[];

    carModels: InMemoryCarModel[];

    private replica: UnitOfWorkReplica;

    constructor(@inject("unitOfWorkState") state: number) {
        this.state = state;
        this.cars = [];
        this.carRentals = [];
        this.carModels = [];
        this.replica = {
            state: state,
            cars: [],
            carRentals: [],
            carModels: [],
        };
    }

    syncSave(): UnitOfWorkMemento {
        this.saveFromReplica();

        return new UnitOfWorkMemento(this.state);
    }

    async save(): Promise<UnitOfWorkMemento> {
        this.saveFromReplica();

        return new UnitOfWorkMemento(this.state);
    }

    private saveFromReplica(): void {
        this.state = JSON.parse(JSON.stringify(this.state));
        this.cars = deepClone(this.replica.cars);
        this.carRentals = deepClone(this.replica.carRentals);
        this.carModels = deepClone(this.replica.carModels);
    }

    async saveEntity(name: string, entity: any): Promise<void> {
        this.replica.state = Date.now();
        // @ts-ignore
        this.replica[name].push(entity);
    }

    restore(memento: UnitOfWorkMemento) {
        this.replica.state = memento.state;
    }
}