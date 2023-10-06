import CarRentalDTO from 'src/core/domain/carRental/dto';
import RetrieveACarRentalQuery from './types/query';
import CarRentalReadRepositoryInterface from 'src/core/domain/carRental/interfaces/repositories/read';

/**
 * Use case class to retrieve a car rental.
 */
export default class RetrieveACarRental {
    private readonly carRentalReadRepository: CarRentalReadRepositoryInterface;

    constructor({carRentalReadRepository}: { carRentalReadRepository: CarRentalReadRepositoryInterface }) {
        this.carRentalReadRepository = carRentalReadRepository;
    }

    async execute(query: RetrieveACarRentalQuery): Promise<CarRentalDTO> {
        const retrievedCarRental = await this.carRentalReadRepository.read(query.id);

        return retrievedCarRental.toDTO();
    }
}