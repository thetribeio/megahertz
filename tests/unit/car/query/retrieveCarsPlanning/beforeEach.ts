import {container} from "tsyringe";
import CarsPlanningDTO from "src/core/domain/car/outputBoundaries/outputBoundary";
import DateParser from "tests/utils/dateParser";
import {CarTestCaseEntry} from "tests/unit/utils/testCase.types";

export const buildExpectedCarsPlanning = (cars: CarTestCaseEntry[], nextCursor: string, prevCursor: null | string): CarsPlanningDTO => {
    const dateParser: DateParser = container.resolve("DateParser");
    const expectedPlanning: CarsPlanningDTO = {
        cars: {},
        cursor: {
            nextPage: nextCursor,
        }
    }
    for (const carTestCaseEntry of cars) {
        expectedPlanning.cars[carTestCaseEntry.id] = {
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