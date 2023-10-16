import {container} from "tsyringe";
import CarsPlanningDTO from "src/core/domain/car/outputBoundaries/outputBoundary";
import DateParser from "tests/utils/dateParser";
import {CarTestCaseEntry} from "tests/unit/utils/testCase.types";

export const buildExpectedCarsPlanning = (cars: CarTestCaseEntry[]): CarsPlanningDTO => {
    const dateParser: DateParser = container.resolve("DateParser");
    const expectedPlanning: CarsPlanningDTO = {
        cars: {},
        cursor: {
            nextPage: null,
        }
    }
    for (const carTestCaseEntry of cars) {
        expectedPlanning.cars[carTestCaseEntry.id] = {
            licensePlate: carTestCaseEntry.licensePlate !== undefined ? carTestCaseEntry.licensePlate : 'AA-123-AA',
            rentals: []
        }
        for (const rentalEntry of carTestCaseEntry.rentals) {
            expectedPlanning.cars[carTestCaseEntry.id].rentals.push(
                {
                    id: rentalEntry.id,
                    pickupDateTime: dateParser.parse(rentalEntry.pickupDateTime),
                    dropOffDateTime: dateParser.parse(rentalEntry.dropOffDateTime),
                }
            )
        }
    }

    return expectedPlanning;
}