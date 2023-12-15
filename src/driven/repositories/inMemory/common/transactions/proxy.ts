import {inject, singleton} from 'tsyringe';
import TransactionManagerInterface from 'src/core/domain/common/interfaces/transactionManager';
import {UnitOfWorkOriginatorInterface} from '../unitOfWork';
import InMemoryTransactionManager from './manager';
import TransactionInterface from 'src/core/domain/common/interfaces/transaction';

/**
 * Transaction manager proxy that can be used by the system's core.
 */
@singleton()
export default class InMemoryTransactionManagerProxy implements TransactionManagerInterface {
    private transactionManager: InMemoryTransactionManager;

    private transaction: TransactionInterface | null;

    constructor(@inject("UnitOfWork") unitOfWork: UnitOfWorkOriginatorInterface) {
        this.transactionManager = new InMemoryTransactionManager(unitOfWork);
        this.transaction = null;
    }

    async startTransaction(): Promise<void> {
        this.transaction = this.transactionManager.newTransaction();
    }

    newTransaction(): TransactionInterface {
        return this.transactionManager.newTransaction();
    }

    async commit(): Promise<void> {
        await this.transaction?.commit();
    }
}