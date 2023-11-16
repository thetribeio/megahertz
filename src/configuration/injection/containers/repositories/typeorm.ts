import {container} from 'tsyringe';
import TypeORMCarRentalReadRepository from 'src/driven/repositories/typeorm/carRental/read';
import TypeORMCarRentalWriteRepository from "src/driven/repositories/typeorm/carRental/write";
import TypeORMTransactionManager from "src/driven/repositories/typeorm/common/transactionManager";

/**
 * Configures tsyringe to use typeORM repositories.
 */
const useTypeORMRepositories = (): void => {
    container.register("TransactionManagerInterface", {useClass: TypeORMTransactionManager});
    container.register("CarRentalReadRepositoryInterface", {useClass: TypeORMCarRentalReadRepository});
    const carRentalReadRepository = container.resolve("CarRentalReadRepositoryInterface");
    container.registerInstance("CarRentalReadRepositoryInterface", carRentalReadRepository);
    container.register("CarRentalWriteRepositoryInterface", {useClass: TypeORMCarRentalWriteRepository});
    const carRentalWriteRepository = container.resolve("CarRentalWriteRepositoryInterface");
    container.registerInstance("CarRentalWriteRepositoryInterface", carRentalWriteRepository);
}

export default useTypeORMRepositories;