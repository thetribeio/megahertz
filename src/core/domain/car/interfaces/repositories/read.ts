import Car from '../../model';
import CarsPlanningDTO from "src/core/domain/car/outputBoundaries/outputBoundary";
import DecodedCursor from "src/core/domain/common/types/cursor";

/**
 * Interface for CarReadRepository.
 *
 * Allows to query an external system (such as a database) to retrieve cars.
 */
export default interface CarReadRepositoryInterface {
    /**
     * Gets an available car, based on the current car rentals in the system and the rental date.
     *
     * @param modelId The car model UID for which to get an available car.
     * @param pickupDateTime The date and time at which the customer will pick up the car.
     * @param dropOffDateTime The date and time at which the customer will drop off the car.
     *
     * @throws UnavailableCarError
     */
    getOneAvailableCar({
                           modelId,
                           pickupDateTime,
                           dropOffDateTime
                       }: { modelId: string, pickupDateTime: Date, dropOffDateTime: Date }): Promise<Car>;

    /**
     * Gets a cars planning (meaning the planning for a selection of cars) based on date range and a cursor.
     *
     * @param startDate
     * @param endDate
     * @param cursor
     */
    getCarsPlanning({
                        startDate,
                        endDate,
                        cursor,
                    }: { startDate: Date, endDate: Date, cursor: DecodedCursor }): Promise<CarsPlanningDTO>;
}