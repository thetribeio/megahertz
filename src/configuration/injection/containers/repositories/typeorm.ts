import {container} from 'tsyringe';
import TypeORMCarRentalReadRepository from '../../../../driven/repositories/typeorm/carRental/read';

/**
 * Configures tsyringe to use typeORM repositories.
 */
const useTypeORMRepositories = (): void => {
    container.register("CarRentalReadRepositoryInterface", {useClass: TypeORMCarRentalReadRepository});
}

export default useTypeORMRepositories;