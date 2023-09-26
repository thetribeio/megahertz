export default interface TransactionInterface {
    commit(): Promise<void>;
}