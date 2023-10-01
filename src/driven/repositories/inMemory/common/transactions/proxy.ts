import {inject, singleton} from 'tsyringe';
import TransactionManagerInterface from '../../../../../core/domain/common/interfaces/transactionManager';
import {UnitOfWorkOriginatorInterface} from '../unitOfWork';
import InMemoryTransactionManager from './manager';
import TransactionInterface from '../../../../../core/domain/common/interfaces/transaction';

@singleton()
export default class InMemoryTransactionManagerProxy implements TransactionManagerInterface {
    private transactionManager: InMemoryTransactionManager;
    private transaction: TransactionInterface | null;

    constructor(@inject("UnitOfWork") unitOfWork: UnitOfWorkOriginatorInterface) {
        this.transactionManager = new InMemoryTransactionManager(unitOfWork);
        this.transaction = null;
    }

    startTransaction(): void {
        this.transaction = this.transactionManager.newTransaction();
    }

    newTransaction(): TransactionInterface {
        return this.transactionManager.newTransaction();
    }

    async commit(): Promise<void> {
        this.transaction?.commit();
    }
}