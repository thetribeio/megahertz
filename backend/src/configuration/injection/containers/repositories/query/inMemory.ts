import {container} from 'tsyringe';
import InMemoryCarReadRepository from '../../../../../driven/repositories/inMemory/car/read';
import UnitOfWork from '../../../../../driven/repositories/inMemory/common/unitOfWork';
import InMemoryCarRentalReadRepository from '../../../../../driven/repositories/inMemory/carRental/read';
import InMemoryCarRentalWriteRepository from '../../../../../driven/repositories/inMemory/carRental/write';

const useInMemoryRepositories = (): void => {
    container.register("UnitOfWork", {useClass: UnitOfWork});
    const unitOfWork = container.resolve("UnitOfWork");
    container.registerInstance("UnitOfWork", unitOfWork);
    container.register("CarReadRepositoryInterface", {useClass: InMemoryCarReadRepository});
    container.register("CarRentalReadRepositoryInterface", {useClass: InMemoryCarRentalReadRepository});
    container.register("CarRentalWriteRepositoryInterface", {useClass: InMemoryCarRentalWriteRepository});
}

export default useInMemoryRepositories;