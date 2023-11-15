import CarRentalDTO from "src/core/domain/carRental/dto";
import {CarRentalTestCaseEntry} from "tests/integration/typeorm/carRental/utils/testCase.types";
import DateParser from "tests/utils/dateParser";

export const expectedCarRentalFromTestCase = (
    testCase: CarRentalTestCaseEntry,
    dateParser: DateParser,
): CarRentalDTO => {
    return {
        id: testCase.id,
        customerId: testCase.customerId,
        car: {
            id: testCase.car.id,
            model: {
                id: testCase.car.model.id,
                dailyRate: testCase.car.model.dailyRate,
            },
        },
        pickupDateTime: dateParser.parse(testCase.pickupDateTime),
        dropOffDateTime: dateParser.parse(testCase.dropOffDateTime),
        totalPrice: testCase.totalPrice,
    } as CarRentalDTO;
}