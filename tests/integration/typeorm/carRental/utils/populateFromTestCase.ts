import {populateCar, populateCarModel, populateCustomer} from "tests/integration/typeorm/utils/populate";
import {TypeORMCar, TypeORMCarModel, TypeORMCustomer} from "src/driven/repositories/typeorm/entities";
import {CarRentalTestCaseEntry} from "tests/integration/typeorm/carRental/utils/testCase.types";

export const populateCustomerFromCarRentalTestCase = async (
    testCase: CarRentalTestCaseEntry,
): Promise<TypeORMCustomer> => {
    return await populateCustomer({id: testCase.customerId});
}

export const populateCarModelFromCarRentalTestCase = async (
    testCase: CarRentalTestCaseEntry,
): Promise<TypeORMCarModel> => {
    return await populateCarModel({
        id: testCase.car.model.id,
        dailyRate: testCase.car.model.dailyRate,
    });
}

export const populateCarAndCarModelFromCarRentalTestCase = async (
    testCase: CarRentalTestCaseEntry,
): Promise<TypeORMCar> => {
    return await populateCar({
        id: testCase.car.id,
        model: await populateCarModelFromCarRentalTestCase(testCase),
    })
}