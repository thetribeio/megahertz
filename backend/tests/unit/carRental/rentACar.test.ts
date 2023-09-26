import 'reflect-metadata';
import {v4} from 'uuid';
import {container} from 'tsyringe';
import {advanceTo} from 'jest-date-mock';
import DateParser from '../../utils/dateParser';
import RentACar from '../../../src/core/useCases/carRental/rentACar/handler';
import RentACarCommand from '../../../src/core/useCases/carRental/rentACar/types/command';
import CarRentalDTO from '../../../src/core/domain/carRental/dto';
import useInMemoryRepositories from '../../../src/configuration/injection/containers/repositories/query/inMemory';
import {convertToNumericPrice} from '../../utils/misc';
import useTestingUtilities from '../../configuration/containers/utils';
import {populateAvailableCarFromTestCase, populateCarsAndCarRentalsFromTestCase} from '../utils/populateFromTestCase';
import {CarTestCaseEntry} from '../utils/testCase.types';
import InMemoryCarRentalReadRepository from '../../../src/driven/repositories/inMemory/carRental/read';
import TransactionInterface from '../../../src/core/domain/common/interfaces/transaction';
import TransactionManagerInterface from '../../../src/core/domain/common/interfaces/transactionManager';
import UnavailableCarError from '../../../src/core/domain/car/errors/unavailable';

describe.each([
    {
        availableCar: {
            id: v4(),
            model: {
                name: 'Ford E-Series 4x4 Van',
                id: '8db13c9d-31af-4c9e-8456-9aafa00a9f76',
                dailyRate: '100€',
            },
            rentals: [],
        },
        cars: [],
        command: {
            customer: {
                id: v4(),
                email: 'frank.castle@usmc.com',
            },
            startDate: 'today',
            endDate: 'tomorrow',
        },
        expected: {
            totalPrice: '100€'
        },
    },
    {
        availableCar: {
            id: v4(),
            model: {
                name: 'Gran Torino',
                id: '230c974a-746a-47a5-b958-0c54f52c0620',
                dailyRate: '900€',
            },
            rentals: [],
        },
        cars: [
            {
                id: '4fb2e816-7b10-452b-8a76-d46bf5ce38d8',
                model: {
                    id: '230c974a-746a-47a5-b958-0c54f52c0620',
                },
                rentals: [
                    {
                        startDate: 'tomorrow',
                        endDate: 'in 5 days',
                    }
                ],
            }
        ] as Array<CarTestCaseEntry>,
        command: {
            customer: {
                id: v4(),
                email: 'walt.kowalski@yahoo.com',
            },
            startDate: 'tomorrow',
            endDate: 'in 3 days',
        },
        expected: {
            totalPrice: '1800€'
        },
    },
    {
        availableCar: {
            id: v4(),
            model: {
                name: 'Aston Martin V8',
                id: 'd430e7e9-aa14-4c66-a1c9-c898f5b74000',
                dailyRate: '3000€',
            },
            rentals: [
                {
                    startDate: 'next friday',
                    endDate: 'next saturday',
                },
                {
                    startDate: 'yesterday',
                    endDate: 'today',
                },
            ],
        },
        cars: [],
        command: {
            customer: {
                id: v4(),
                email: 'james.bond@mi6.com',
            },
            startDate: 'tomorrow',
            endDate: 'in 3 days',
        },
        expected: {
            totalPrice: '6000€'
        },
    },
])('Scenario: A simple car rental ' +
    'Given I am logged in as customer $command.customer.email ' +
    'And the daily price for a $availableCar.model.name is $availableCar.model.dailyRate ' +
    'When I rent a $availableCar.model.name starting $command.startDate and ending $command.endDate ', function (testCase) {
    let uc: RentACar;
    let expectedCarRental: Partial<CarRentalDTO>;
    let dateParser: DateParser;
    let command: RentACarCommand;
    let carRentalReadRepository: InMemoryCarRentalReadRepository;

    beforeAll(() => {
        advanceTo(Date.now());
        useTestingUtilities();
        dateParser = container.resolve("DateParser");
    });

    beforeEach(async () => {
        useInMemoryRepositories();
        const transactionManager: TransactionManagerInterface = container.resolve("TransactionManagerInterface");
        const transaction: TransactionInterface = transactionManager.newTransaction();
        await populateCarsAndCarRentalsFromTestCase(testCase.cars);
        await populateAvailableCarFromTestCase(testCase.availableCar as CarTestCaseEntry);
        await transaction.commit();
        carRentalReadRepository = container.resolve("CarRentalReadRepositoryInterface");
        uc = new RentACar({
            carReadRepository: container.resolve("CarReadRepositoryInterface"),
            carRentalWriteRepository: container.resolve("CarRentalWriteRepositoryInterface"),
            transactionManager: container.resolve("TransactionManagerInterface"),
        });
        command = {
            customerId: testCase.command.customer.id,
            carModelId: testCase.availableCar.model.id,
            startDate: dateParser.parse(testCase.command.startDate),
            endDate: dateParser.parse(testCase.command.endDate),
        };
        expectedCarRental = {
            customerId: testCase.command.customer.id,
            car: {
                id: testCase.availableCar.id,
                modelId: testCase.availableCar.model.id,
            },
            totalPrice: convertToNumericPrice(testCase.expected.totalPrice),
            startDate: dateParser.parse(testCase.command.startDate),
            endDate: dateParser.parse(testCase.command.endDate),
        };
    })

    it(
        `Then it should create a new car rental for a total of ${testCase.expected.totalPrice}`, async () => {
            const carRental = await uc.execute(command);
            expectedCarRental.id = carRental.id;
            const retrievedCarRental = await carRentalReadRepository.read(carRental.id);
            expect(carRental).toEqual(expectedCarRental);
            expect(retrievedCarRental.toDTO()).toEqual(expectedCarRental);
        })
});

describe.each([
    {
        availableCar: {
            id: v4(),
            model: {
                name: 'Ford E-Series 4x4 Van',
                id: '8db13c9d-31af-4c9e-8456-9aafa00a9f76',
                dailyRate: '100€',
            },
            rentals: [
                {
                    startDate: 'today',
                    endDate: 'in 5 days',
                }
            ],
        },
        cars: [],
        command: {
            customer: {
                id: v4(),
                email: 'frank.castle@usmc.com',
            },
            startDate: 'today',
            endDate: 'tomorrow',
        },
        expected: {},
    },
])('Scenario: No available cars ' +
    'Given I am logged in as customer $command.customer.email ' +
    'And there is 1 $unavailableCar.model.name in the system ' +
    'And $unavailableCar.model.name is unavailable ' +
    'When I rent a $$unavailableCar.model.name starting $command.startDate and ending $command.endDate ', (testCase) => {
    let uc: RentACar;
    let dateParser: DateParser;
    let command: RentACarCommand;

    beforeAll(() => {
        advanceTo(Date.now());
        useTestingUtilities();
        dateParser = container.resolve("DateParser");
    });

    beforeEach(async () => {
        useInMemoryRepositories();
        const transactionManager: TransactionManagerInterface = container.resolve("TransactionManagerInterface");
        const transaction: TransactionInterface = transactionManager.newTransaction();
        await populateAvailableCarFromTestCase(testCase.availableCar as CarTestCaseEntry);
        await transaction.commit();
        uc = new RentACar({
            carReadRepository: container.resolve("CarReadRepositoryInterface"),
            carRentalWriteRepository: container.resolve("CarRentalWriteRepositoryInterface"),
            transactionManager: container.resolve("TransactionManagerInterface"),
        });
        command = {
            customerId: testCase.command.customer.id,
            carModelId: testCase.availableCar.model.id,
            startDate: dateParser.parse(testCase.command.startDate),
            endDate: dateParser.parse(testCase.command.endDate),
        };
    })

    it(
        `Then it should raise an error 'UnavailableCarError'`, async () => {
            await expect(uc.execute(command)).rejects.toThrow(
                UnavailableCarError
            );
        })
})