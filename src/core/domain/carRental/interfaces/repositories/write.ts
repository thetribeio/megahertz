import CarRentalDTO from '../../dto';

/**
 * Interface for CarRentalWriteRepository.
 *
 * Allows to command an external system (such as a database) to create, update or delete car rentals.
 */
export default interface CarRentalWriteRepositoryInterface {
    /**
     * Creates a new car rental in the system.
     *
     * @param carRentalDTO The car rental Data Transfer Object to be use for creation.
     */
    create(carRentalDTO: CarRentalDTO): Promise<void>
}