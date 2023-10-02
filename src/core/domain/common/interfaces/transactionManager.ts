import TransactionInterface from './transaction';

/**
 * Interface to manage commits and rollbacks within the system's core.
 *
 * This interface is most likely to be proxied by your implementations.
 */
export default interface TransactionManagerInterface {
    /**
     * Starts a transaction block, within which change of states will be atomic.
     */
    startTransaction(): void;

    /**
     * Creates and returns a new transaction
     * that can be used to commit without the need of the method startTransaction().
     */
    newTransaction(): TransactionInterface;

    /**
     * Commits a change of state in the system.
     */
    commit(): Promise<void>;
}