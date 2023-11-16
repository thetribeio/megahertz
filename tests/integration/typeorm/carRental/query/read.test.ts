import 'reflect-metadata';
import {container} from 'tsyringe';
import {v4} from 'uuid';
import {advanceTo} from 'jest-date-mock';
import useTypeORMRepositories from 'src/configuration/injection/containers/repositories/typeorm';
import useAppDataSources from 'src/configuration/injection/containers/database';
import DateParser from 'tests/utils/dateParser';
import useTestingUtilities from 'tests/configuration/containers/utils';
import TypeORMCarRentalReadRepository from 'src/driven/repositories/typeorm/carRental/read';
import CarRentalDTO from 'src/core/domain/carRental/dto';
import TypeORMCarRentalFactory from 'tests/integration/typeorm/seeding/factories/carRental';
import {runDataSourceBeforeEachOps} from 'tests/integration/typeorm/utils/setup';
import {runDataSourceAfterEachOps} from 'tests/integration/typeorm/utils/tearDown';
import {
    populateCarAndCarModelFromCarRentalTestCase,
    populateCustomerFromCarRentalTestCase
} from "tests/integration/typeorm/carRental/utils/populateFromTestCase";
import {expectedCarRentalFromTestCase} from "tests/integration/typeorm/utils/misc";

describe.each([
    {
        rental: {
            id: v4(),
            customerId: v4(),
            car: {
                id: v4(),
                model: {
                    id: '28837cd2-512c-4212-b934-c10d36ddfd7f',
                    dailyRate: 100,
                }
            },
            totalPrice: 100,
            pickupDateTime: 'today',
            dropOffDateTime: 'tomorrow',
        }
    },
    {
        rental: {
            id: v4(),
            customerId: v4(),
            car: {
                id: v4(),
                model: {
                    id: v4(),
                    dailyRate: 200,
                }
            },
            totalPrice: 200,
            pickupDateTime: 'tomorrow',
            dropOffDateTime: 'in 2 days',
        }
    },
])("Integration tests to read car rental  from a postgres database using typeorm", (testCase) => {
    let repository: TypeORMCarRentalReadRepository;
    let expectedCarRental: Partial<CarRentalDTO>;
    let dateParser: DateParser;

    beforeAll(async () => {
        advanceTo(Date.now());
        useTestingUtilities();
        useAppDataSources();
        useTypeORMRepositories();
        dateParser = container.resolve("DateParser");
        repository = container.resolve("CarRentalReadRepositoryInterface");
    })

    beforeEach(async () => {
        await runDataSourceBeforeEachOps();
        const customer = await populateCustomerFromCarRentalTestCase(testCase.rental);
        const car = await populateCarAndCarModelFromCarRentalTestCase(testCase.rental);
        await new TypeORMCarRentalFactory().create({
            id: testCase.rental.id,
            totalPrice: testCase.rental.totalPrice,
            pickupDateTime: dateParser.parse(testCase.rental.pickupDateTime),
            dropOffDateTime: dateParser.parse(testCase.rental.dropOffDateTime),
            customer,
            car,
        });
        expectedCarRental = expectedCarRentalFromTestCase(
            testCase.rental,
            dateParser,
        );
    })

    afterEach(async () => {
        await runDataSourceAfterEachOps();
    })

    test(`Read a car rental ${testCase.rental.id} should return one car rental`, async () => {
        const retrievedCarRental = await repository.read(testCase.rental.id);
        expect(retrievedCarRental.toDTO()).toEqual(expectedCarRental);
    })
})