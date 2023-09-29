import 'reflect-metadata';
import {v4} from 'uuid';
import {container} from 'tsyringe';
import UnitOfWork from '../../../src/driven/repositories/inMemory/common/unitOfWork';
import DateParser from '../../utils/dateParser';
import {populateCar, populateCarModel, populateCarRental} from './populate';
import {CarTestCaseEntry} from './testCase.types';
import {convertToNumericPrice} from '../../utils/misc';

/**
 * Populates the system with an available car and its rentals,
 * based on a given dataset.
 *
 * @param testCase The testcase containing the car to populate.
 */
export const populateAvailableCarFromTestCase = async (testCase: CarTestCaseEntry) => {
    const unitOfWork: UnitOfWork = container.resolve("UnitOfWork");
    const dateParser: DateParser = container.resolve("DateParser");

    await populateCarModel({
        id: testCase.model.id,
        dailyRate: convertToNumericPrice(testCase.model.dailyRate as string),
    }, unitOfWork);

    await populateCar({id: testCase.id, modelId: testCase.model.id}, unitOfWork);

    for (const rental of testCase.rentals) {
        await populateCarRental({
            id: v4(),
            customerId: v4(),
            carId: testCase.id,
            modelId: testCase.model.id,
            pickupDateTime: dateParser.parse(rental.pickupDateTime),
            dropOffDateTime: dateParser.parse(rental.dropOffDateTime),
        }, unitOfWork)
    }
}


/**
 * Populates the system with cars and their matching rentals,
 * based on a given testcase dataset.
 *
 * @param testCase The testcase dataset containing the cars and rentals to populate.
 */
export const populateCarsAndCarRentalsFromTestCase = async (testCase: CarTestCaseEntry[]) => {
    const unitOfWork: UnitOfWork = container.resolve("UnitOfWork");
    const dateParser: DateParser = container.resolve("DateParser");

    for (const car of testCase) {
        await populateCar({id: car.id, modelId: car.model.id}, unitOfWork);
        for (const carRental of car.rentals) {
            await populateCarRental({
                id: v4(),
                carId: car.id,
                dropOffDateTime: dateParser.parse(carRental.dropOffDateTime),
                modelId: car.model.id,
                pickupDateTime: dateParser.parse(carRental.pickupDateTime),
                customerId: carRental.customerId !== undefined ? carRental.customerId : v4(),
            }, unitOfWork);
        }
    }
}

