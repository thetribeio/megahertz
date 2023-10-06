import {container} from 'tsyringe';
import TypeORMCarRentalReadRepository from 'src/driven/repositories/typeorm/carRental/read';

/**
 * Configures tsyringe to use typeORM repositories.
 */
const useTypeORMRepositories = (): void => {
    container.register("CarRentalReadRepositoryInterface", {useClass: TypeORMCarRentalReadRepository});
    const carRentalReadRepository = container.resolve("CarRentalReadRepositoryInterface");
    container.registerInstance("CarRentalReadRepositoryInterface", carRentalReadRepository);
}

export default useTypeORMRepositories;