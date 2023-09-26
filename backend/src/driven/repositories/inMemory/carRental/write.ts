import {inject, injectable} from 'tsyringe';
import UnitOfWork from '../common/unitOfWork';
import CarRentalWriteRepositoryInterface from '../../../../core/domain/carRental/interfaces/repositories/write';
import CarRentalDTO from '../../../../core/domain/carRental/dto';
import TransactionInterface from '../../../../core/domain/common/interfaces/transaction';

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
            modelId: carRentalDTO.car.modelId,
            endDate: carRentalDTO.endDate,
            startDate: carRentalDTO.startDate,
            customerId: carRentalDTO.customerId,
            totalPrice: carRentalDTO.totalPrice,
        })
        // this.unitOfWork.carRentals.push({
        //     id: carRentalDTO.id,
        //     carId: carRentalDTO.car.id,
        //     modelId: carRentalDTO.car.modelId,
        //     endDate: carRentalDTO.endDate,
        //     startDate: carRentalDTO.startDate,
        //     customerId: carRentalDTO.customerId,
        //     totalPrice: carRentalDTO.totalPrice,
        // })
    }
}