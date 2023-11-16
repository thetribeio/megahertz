import 'reflect-metadata';
import {container} from "tsyringe";
import TypeORMCarRentalWriteRepository from "src/driven/repositories/typeorm/carRental/write";
import useAppDataSources from "src/configuration/injection/containers/database";
import useTypeORMRepositories from "src/configuration/injection/containers/repositories/typeorm";
import CarRentalDTO from "src/core/domain/carRental/dto";
import TypeORMCarRentalReadRepository from "src/driven/repositories/typeorm/carRental/read";
import {runDataSourceBeforeEachOps} from "tests/integration/typeorm/utils/setup";
import DateParser from "tests/utils/dateParser";
import {advanceTo} from "jest-date-mock";
import useTestingUtilities from "tests/configuration/containers/utils";
import {v4} from "uuid";
import {runDataSourceAfterEachOps} from "tests/integration/typeorm/utils/tearDown";
import {
    populateCarAndCarModelFromCarRentalTestCase,
    populateCustomerFromCarRentalTestCase
} from "tests/integration/typeorm/carRental/utils/populateFromTestCase";
import {expectedCarRentalFromTestCase} from "tests/integration/typeorm/utils/misc";
import TypeORMTransactionManager from "src/driven/repositories/typeorm/common/transactionManager";

describe.each([
    {
        rental: {
            id: v4(),
            customerId: v4(),
            car: {
                id: v4(),
                model: {
                    id: v4(),
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
                    dailyRate: 100,
                }
            },
            totalPrice: 200,
            pickupDateTime: 'tomorrow',
            dropOffDateTime: 'in 2 days',
        }
    },
])("Integration tests to create car rental in a postgres database using typeorm", (testCase) => {
    let repository: TypeORMCarRentalWriteRepository;
    let readRepository: TypeORMCarRentalReadRepository;
    let carRentalToCreate: CarRentalDTO;
    let expectedCarRental: CarRentalDTO;
    let dateParser: DateParser;
    let transactionManager: TypeORMTransactionManager;

    beforeAll(() => {
        advanceTo(Date.now());
        useTestingUtilities();
        useAppDataSources();
        useTypeORMRepositories();
        dateParser = container.resolve("DateParser");
    })

    beforeEach(async () => {
        repository = container.resolve("CarRentalWriteRepositoryInterface");
        readRepository = container.resolve("CarRentalReadRepositoryInterface");
        await runDataSourceBeforeEachOps();
        transactionManager = container.resolve("TransactionManagerInterface");
        await populateCustomerFromCarRentalTestCase(testCase.rental);
        await populateCarAndCarModelFromCarRentalTestCase(testCase.rental);
        expectedCarRental = expectedCarRentalFromTestCase(
            testCase.rental,
            dateParser,
        );
        carRentalToCreate = expectedCarRental;
    })

    afterEach(async () => {
        await runDataSourceAfterEachOps();
    })

    test(`Create a car rental ${testCase.rental.id} should create one car rental in the database`, async () => {
        await transactionManager.startTransaction();
        await repository.create(carRentalToCreate);
        await transactionManager.commit();
        const retrievedCarRental = await readRepository.read(testCase.rental.id);
        expect(retrievedCarRental.toDTO()).toEqual(expectedCarRental);
    })
})