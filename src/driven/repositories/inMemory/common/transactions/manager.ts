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
     * Returns a new in memory transaction.
     */
    newTransaction(): InMemoryTransaction {
        return new InMemoryTransaction(this.unitOfWork);
    }
}