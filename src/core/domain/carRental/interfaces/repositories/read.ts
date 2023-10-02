import CarRental from '../../model';

/**
 * Interface for CarRentalReadRepository.
 *
 * Allows to query an external system (such as a database) to retrieve car rentals.
 */
export default interface CarRentalReadRepositoryInterface {
    /**
     * Gets a single car rental based a UID.
     *
     * @param carRentalId The UID of the car rental to get.
     */
    read(carRentalId: string): Promise<CarRental>
}