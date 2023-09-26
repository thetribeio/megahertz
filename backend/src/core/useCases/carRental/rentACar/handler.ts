import {v4} from 'uuid';
import CarRentalDTO from '../../../domain/carRental/dto';
import RentACarCommand from './types/command';
import CarReadRepositoryInterface from '../../../domain/car/interfaces/repositories/read';
import CarRentalWriteRepositoryInterface from '../../../domain/carRental/interfaces/repositories/write';
import CarRental from '../../../domain/carRental/model';
import TransactionManagerInterface from '../../../domain/common/interfaces/transactionManager';

export default class RentACar {
    private readonly carReadRepository: CarReadRepositoryInterface;
    private readonly carRentalWriteRepository: CarRentalWriteRepositoryInterface;
    private readonly transactionManager: TransactionManagerInterface;

    constructor({
                    carReadRepository,
                    carRentalWriteRepository,
                    transactionManager,
    }: {
        carReadRepository: CarReadRepositoryInterface,
        carRentalWriteRepository: CarRentalWriteRepositoryInterface,
        transactionManager: TransactionManagerInterface,
    }) {
        this.carReadRepository = carReadRepository;
        this.carRentalWriteRepository = carRentalWriteRepository;
        this.transactionManager = transactionManager;
    }

    async execute(command: RentACarCommand): Promise<CarRentalDTO> {
        const transaction = this.transactionManager.newTransaction();
        const availableCar = await this.carReadRepository.getOneAvailableCar({
            modelId: command.carModelId,
            startDate: command.startDate,
            endDate: command.endDate,
        });
        const carRental = new CarRental({
            id: v4(),
            car: availableCar,
            customerId: command.customerId,
            totalPrice: 0,
            startDate: command.startDate,
            endDate: command.endDate,
        });
        carRental.computeTotalPrice();
        const carRentalDTO = carRental.toDTO();
        await this.carRentalWriteRepository.create(carRentalDTO);
        await transaction.commit();

        return carRentalDTO;
    }
}