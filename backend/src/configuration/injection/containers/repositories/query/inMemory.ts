import {container} from 'tsyringe';
import InMemoryCarReadRepository from '../../../../../driven/repositories/inMemory/car/read';
import UnitOfWork from '../../../../../driven/repositories/inMemory/common/unitOfWork';

const configureInMemoryRepositories = (): void => {
    container.register("UnitOfWork", {useClass: UnitOfWork});
    const unitOfWork = container.resolve("UnitOfWork");
    container.registerInstance("UnitOfWork", unitOfWork);
    container.register("CarReadRepositoryInterface", {useClass: InMemoryCarReadRepository});
}

export default configureInMemoryRepositories;