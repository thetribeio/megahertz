import TransactionInterface from './transaction';

export default interface TransactionManagerInterface {
    newTransaction(): TransactionInterface;
}