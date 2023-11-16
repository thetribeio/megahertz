import {UnitOfWorkOriginatorInterface} from '../unitOfWork';
import InMemoryTransaction from '../transaction';

/**
 * Transaction manager class, capable of building in memory transaction instances.
 */
export default class InMemoryTransactionManager {
    private readonly unitOfWork: UnitOfWorkOriginatorInterface;

    constructor(unitOfWork: UnitOfWorkOriginatorInterface) {
        this.unitOfWork = unitOfWork;
    }

    /**
     * Creates and returns a new transaction
     * that can be used to commit without the need of the method startTransaction().
     */
    newTransaction(): InMemoryTransaction {
        return new InMemoryTransaction(this.unitOfWork);
    }
}