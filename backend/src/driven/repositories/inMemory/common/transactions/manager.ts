import {UnitOfWorkOriginatorInterface} from '../unitOfWork';
import InMemoryTransaction from '../transaction';

export default class InMemoryTransactionManager {
    private unitOfWork: UnitOfWorkOriginatorInterface;

    constructor(unitOfWork: UnitOfWorkOriginatorInterface) {
        this.unitOfWork = unitOfWork;
    }

    newTransaction(): InMemoryTransaction {
        return new InMemoryTransaction(this.unitOfWork);
    }
}