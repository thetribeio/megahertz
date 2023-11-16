import {v4} from 'uuid';
import CarRentalDTO from 'src/core/domain/carRental/dto';
import RentACarCommand from 'src/core/useCases/carRental/command/rentACar/types/command';
import CarReadRepositoryInterface from 'src/core/domain/car/interfaces/repositories/read';
import CarRentalWriteRepositoryInterface from 'src/core/domain/carRental/interfaces/repositories/write';
import CarRental from 'src/core/domain/carRental/model';
import TransactionManagerInterface from 'src/core/domain/common/interfaces/transactionManager';

/**
 * Use case class to rent a car for a customer.
 */
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
        await this.transactionManager.startTransaction();
        const availableCar = await this.carReadRepository.getOneAvailableCar({
            modelId: command.carModelId,
            pickupDateTime: command.pickupDateTime,
            dropOffDateTime: command.dropOffDateTime,
        });
        const carRental = new CarRental({
            id: v4(),
            car: availableCar,
            customerId: command.customerId,
            totalPrice: 0,
            pickupDateTime: command.pickupDateTime,
            dropOffDateTime: command.dropOffDateTime,
        });
        carRental.computeTotalPrice();
        const carRentalDTO = carRental.toDTO();
        await this.carRentalWriteRepository.create(carRentalDTO);
        await this.transactionManager.commit();

        return carRentalDTO;
    }
}