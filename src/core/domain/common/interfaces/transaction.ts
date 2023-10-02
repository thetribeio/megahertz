/**
 * Interface for transactions.
 */
export default interface TransactionInterface {
    /**
     * Commits a change of state in the system.
     */
    commit(): Promise<void>;
}