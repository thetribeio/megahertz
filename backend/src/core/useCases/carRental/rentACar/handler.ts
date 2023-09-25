import {v4} from 'uuid';
import CarRentalDTO from '../../../domain/carRental/dto';
import RentACarCommand from './types/command';
import CarReadRepositoryInterface from '../../../domain/car/interfaces/repositories/read';
import CarRentalWriteRepositoryInterface from '../../../domain/carRental/interfaces/repositories/write';
import CarRental from '../../../domain/carRental/model';

export default class RentACar {
    private readonly carReadRepository: CarReadRepositoryInterface;
    private readonly carRentalWriteRepository: CarRentalWriteRepositoryInterface;

    constructor({
                    carReadRepository,
                    carRentalWriteRepository,
    }: {
        carReadRepository: CarReadRepositoryInterface,
        carRentalWriteRepository: CarRentalWriteRepositoryInterface,
    }) {
        this.carReadRepository = carReadRepository;
        this.carRentalWriteRepository = carRentalWriteRepository;
    }

    async execute(command: RentACarCommand): Promise<CarRentalDTO> {
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

        return carRentalDTO;
    }
}