import CarRentalDTO from '../../../domain/carRental/dto';
import {add} from 'date-fns';
import RentACarCommand from './types/command';
import CarReadRepositoryInterface from '../../../domain/car/interfaces/repositories/read';

export default class RentACar {
    private readonly carReadRepository: CarReadRepositoryInterface;

    constructor({carReadRepository}: { carReadRepository: CarReadRepositoryInterface }) {
        this.carReadRepository = carReadRepository;
    }

    async execute(command: RentACarCommand): Promise<CarRentalDTO> {
        const availableCar = await this.carReadRepository.getOneAvailableCar({
            modelId: command.carModelId,
        });
        const availableCarDTO = availableCar.toDTO();
        return {
            customerId: command.customerId,
            car: {
                id: availableCarDTO.id,
            },
            totalPrice: 1245,
            startDate: add(new Date(), {days: 1})
        }
    }
}