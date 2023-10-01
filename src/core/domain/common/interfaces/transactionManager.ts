import TransactionInterface from './transaction';

export default interface TransactionManagerInterface {
    startTransaction(): void;
    newTransaction(): TransactionInterface;
    commit(): Promise<void>;
}