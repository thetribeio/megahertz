import {container} from 'tsyringe';
import InMemoryCarReadRepository from 'src/driven/repositories/inMemory/car/read';
import UnitOfWork from 'src/driven/repositories/inMemory/common/unitOfWork';
import InMemoryCarRentalReadRepository from 'src/driven/repositories/inMemory/carRental/read';
import InMemoryCarRentalWriteRepository from 'src/driven/repositories/inMemory/carRental/write';
import InMemoryTransactionManagerProxy from 'src/driven/repositories/inMemory/common/transactions/proxy';

/**
 * Configures tsyringe to use inMemory repositories.
 */
const useInMemoryRepositories = (): void => {
    container.register("unitOfWorkState", {useValue: Date.now()});
    container.register("UnitOfWork", {useClass: UnitOfWork});
    const unitOfWork = container.resolve("UnitOfWork");
    container.registerInstance("UnitOfWork", unitOfWork);
    container.register("TransactionManagerInterface", {useClass: InMemoryTransactionManagerProxy});
    const transactionManager = container.resolve("TransactionManagerInterface");
    container.registerInstance("TransactionManagerInterface", transactionManager);
    container.register("CarReadRepositoryInterface", {useClass: InMemoryCarReadRepository});
    container.register("CarRentalReadRepositoryInterface", {useClass: InMemoryCarRentalReadRepository});
    container.register("CarRentalWriteRepositoryInterface", {useClass: InMemoryCarRentalWriteRepository});
}

export default useInMemoryRepositories;