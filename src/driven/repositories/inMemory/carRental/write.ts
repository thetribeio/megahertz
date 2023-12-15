import {inject, injectable} from 'tsyringe';
import UnitOfWork from '../common/unitOfWork';
import CarRentalWriteRepositoryInterface from 'src/core/domain/carRental/interfaces/repositories/write';
import CarRentalDTO from 'src/core/domain/carRental/dto';

@injectable()
export default class InMemoryCarRentalWriteRepository implements CarRentalWriteRepositoryInterface {
    private readonly unitOfWork: UnitOfWork;

    constructor(@inject("UnitOfWork") unitOfWork: UnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    async create(carRentalDTO: CarRentalDTO): Promise<void> {
        await this.unitOfWork.saveEntity("carRentals", {
            id: carRentalDTO.id,
            carId: carRentalDTO.car.id,
            modelId: carRentalDTO.car.model.id,
            dropOffDateTime: carRentalDTO.dropOffDateTime,
            pickupDateTime: carRentalDTO.pickupDateTime,
            customerId: carRentalDTO.customerId,
            totalPrice: carRentalDTO.totalPrice,
        })
    }
}