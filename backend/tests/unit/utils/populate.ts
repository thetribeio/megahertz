import UnitOfWork from '../../../src/driven/repositories/inMemory/common/unitOfWork';
import InMemoryCarModel from '../../../src/driven/repositories/inMemory/carModel/carModel.entity';

/**
 * Populates the unit of work with a car.
 *
 * @param id The car UID.
 * @param modelId The car model UID.
 * @param unitOfWork The unit of work that will be populated.
 */
export const populateCar = async ({id, modelId}: { id: string, modelId: string }, unitOfWork: UnitOfWork) => {
    await unitOfWork.saveEntity("cars", {
        id,
        modelId,
    })
}

/**
 * Populates the unit of work with a car model.
 *
 * @param id The car model UID.
 * @param dailyRate The car model daily rate for renting.
 * @param unitOfWork The unit of work that will be populated.
 */
export const populateCarModel = async (
    {
        id,
        dailyRate,
    }: {
        id: string,
        dailyRate: number,
    }, unitOfWork: UnitOfWork) => {
    await unitOfWork.saveEntity("carModels", {
        id,
        dailyRate
    } as InMemoryCarModel);
}

/**
 * Populates the unit of work with a car rental.
 *
 * @param id The car rental UID.
 * @param carId The associated car UID.
 * @param modelId The associated car model UID.
 * @param pickupDateTime The date when the rental starts.
 * @param dropOffDateTime The date when the rental ends.
 * @param customerId The customer UID that booked the car.
 * @param unitOfWork The unit of work that will be populated.
 */
export const populateCarRental = async (
    {
        id,
        carId,
        modelId,
        pickupDateTime,
        dropOffDateTime,
        customerId,
    }: {
        id: string,
        carId: string,
        modelId: string,
        pickupDateTime: Date,
        dropOffDateTime: Date,
        customerId: string,
    }, unitOfWork: UnitOfWork) => {
    await unitOfWork.saveEntity("carRentals", {
        id,
        carId,
        pickupDateTime,
        modelId,
        customerId,
        totalPrice: 0,
        dropOffDateTime,
    })
}

