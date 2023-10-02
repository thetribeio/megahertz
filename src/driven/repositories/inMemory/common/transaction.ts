import {UnitOfWorkOriginatorInterface} from './unitOfWork';
import UnitOfWorkMemento from './memento';

/**
 * Caretaker for UnitOfWorkOriginator.
 */
export default class InMemoryTransaction {
    originator: UnitOfWorkOriginatorInterface;

    private mementos: UnitOfWorkMemento[];

    constructor(originator: UnitOfWorkOriginatorInterface) {
        this.originator = originator;
        this.mementos = [];
        this.mementos.push(this.originator.syncSave());
    }

    /**
     * Commits a change of state in the care taker mementos.
     */
    async commit(): Promise<void> {
        this.mementos.push(await this.originator.save());
    }

    /**
     * Rollbacks the care taker state to the latest version
     * and restores the previous memento.
     *
     * The memento currently does not handle any change beside for the 'state' property.
     * The rest will be implemented as soon as a use case requires it.
     */
    rollback(): void {
        const latestMemento = this.mementos.pop() as UnitOfWorkMemento;
        this.originator.restore(latestMemento);
    }
}