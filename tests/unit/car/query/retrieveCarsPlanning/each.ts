import {v4} from "uuid";
import {CarModelTestCaseEntry, CarTestCaseEntry} from "tests/unit/utils/testCase.types";

export const buildCarTestCase = ({id}: { id: string }): CarTestCaseEntry => {
    const numericLicensePlate = Math.floor(Math.random() * (999 - 100 + 1) + 100);
    return {
        id,
        licensePlate: `AA-${numericLicensePlate}-AA`,
        model: {
            id: '086e0785-b788-479d-a2b2-a193f9805859',
        } as CarModelTestCaseEntry,
        rentals: [],
    } as CarTestCaseEntry
}

export const buildCarTestCases = (numCases: number): CarTestCaseEntry[] => {
    const testCases = [];
    for (let i = 0; i < numCases; i++) {
        testCases.push(buildCarTestCase({id: v4()}))
    }

    return testCases;
}