import 'reflect-metadata';
import {inject, singleton} from 'tsyringe';
import InMemoryCar from '../car/car.entity';
import InMemoryCarRental from '../carRental/carRental.entity';
import InMemoryCarModel from '../carModel/carModel.entity';
import UnitOfWorkMemento from './memento';
import deepClone from 'deep-clone';

/**
 * Type required by the originator UnitOfWork.
 *
 * A replica stores pending changes of state.
 */
export type UnitOfWorkReplica = {
    state: number;

    cars: InMemoryCar[];

    carRentals: InMemoryCarRental[];

    carModels: InMemoryCarModel[];
}

/**
 * Interface for the originator required by InMemoryTransaction.
 */
export interface UnitOfWorkOriginatorInterface {
    /**
     * Saves a change of state using the originator replica.
     */
    save(): Promise<UnitOfWorkMemento>;

    /**
     * Saves an entity, without committing.
     * No change of state is applied until UnitOfWorkOriginatorInterface.save() is called.
     *
     * @param name The entity's name plural (Eg: cars)
     * @param entity The entity to save.
     */
    saveEntity(name: string, entity: any): Promise<void>;

    /**
     * Saves a change of state in a synchronous manner.
     * This method is required by the originator constructor that cannot be defined as asynchronous.
     */
    syncSave(): UnitOfWorkMemento;

    /**
     * Restores the state of the originator using a memento.
     * As specified in the care taker documentation,
     * the memento currently does not handle any change beside for the 'state' property.
     * The rest will be implemented as soon as a use case requires it.
     *
     * @param memento The memento to use for restoration.
     */
    restore(memento: UnitOfWorkMemento): void;
}

/**
 * Originator required by care taker InMemoryTransaction.
 */
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
            state,
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