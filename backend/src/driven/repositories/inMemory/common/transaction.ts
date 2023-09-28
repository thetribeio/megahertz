import {UnitOfWorkOriginatorInterface} from './unitOfWork';
import UnitOfWorkMemento from './memento';

export default class InMemoryTransaction {
    originator: UnitOfWorkOriginatorInterface;

    private mementos: UnitOfWorkMemento[];

    constructor(originator: UnitOfWorkOriginatorInterface) {
        this.originator = originator;
        this.mementos = [];
        this.mementos.push(this.originator.syncSave());
    }

    async commit(): Promise<void> {
        this.mementos.push(await this.originator.save());
    }

    rollback(): void {
        const latestMemento = this.mementos.pop() as UnitOfWorkMemento;
        this.originator.restore(latestMemento);
    }
}