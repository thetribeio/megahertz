import 'reflect-metadata';
import {v4} from 'uuid';
import {container} from 'tsyringe';
import UnitOfWork from '../../../src/driven/repositories/inMemory/common/unitOfWork';
import DateParser from '../../utils/dateParser';
import {populateCar, populateCarRental} from './populate';
import {CarTestCaseEntry} from "./testCase.types";


/**
 * Populates the system with cars and their matching rentals,
 * based on a given testcase dataset.
 *
 * @param testCase The testcase dataset containing the cars and rentals to populate.
 */
export const populateCarsAndCarRentalsFromTestCase = (testCase: CarTestCaseEntry[]) => {
    const unitOfWork: UnitOfWork = container.resolve("UnitOfWork");
    const dateParser: DateParser = container.resolve("DateParser");

    for (const car of testCase) {
        populateCar({id: car.id, modelId: car.model.id}, unitOfWork);
        for (const carRental of car.rentals) {
            populateCarRental({
                id: v4(),
                carId: car.id,
                endDate: dateParser.parse(carRental.endDate),
                modelId: car.model.id,
                startDate: dateParser.parse(carRental.startDate),
                customerId: carRental.customerId !== undefined ? carRental.customerId : v4(),
            }, unitOfWork);
        }
    }
}

