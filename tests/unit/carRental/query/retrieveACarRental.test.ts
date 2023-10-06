import 'reflect-metadata';
import {container} from 'tsyringe';
import {advanceTo} from 'jest-date-mock';
import useTestingUtilities from 'tests/configuration/containers/utils';
import RetrieveACarRental from 'src/core/useCases/carRental/retrieveACarRental/handler';
import DateParser from 'tests/utils/dateParser';
import useInMemoryRepositories from 'src/configuration/injection/containers/repositories/inMemory';
import TransactionManagerInterface from 'src/core/domain/common/interfaces/transactionManager';
import TransactionInterface from 'src/core/domain/common/interfaces/transaction';
import CarRentalDTO from 'src/core/domain/carRental/dto';
import {convertToNumericPrice} from 'tests/utils/misc';
import RetrieveACarRentalQuery from 'src/core/useCases/carRental/retrieveACarRental/types/query';
import {populateCarModel, populateCarRental} from '../../utils/populate';
import UnitOfWork from 'src/driven/repositories/inMemory/common/unitOfWork';
import InMemoryCarRentalReadRepository from 'src/driven/repositories/inMemory/carRental/read';

describe.each([
    {
        carRental: {
            id: '1dac560c-b8b1-4caf-b79e-52e9eea1bcef',
            customerId: '170f4869-7270-4f15-b931-2bfd8d5e6bb3',
            pickupDateTime: 'today',
            dropOffDateTime: 'tomorrow',
            car: {
                id: '7c9d312e-77d0-4d20-926f-b0062b188d19',
                model: {
                    id: 'c7bacec0-4e80-4cd5-9c0d-6869696a6331',
                    name: 'Aston Martin V8'
                },
            },
            totalPrice: '900€',
        },
        query: {
            customer: {
                email: 'james.bond@mi6.com',
            }
        }
    },
    {
        carRental: {
            id: '9cdf0321-1073-4c8c-99c6-a19ffaa987d4',
            customerId: '5b2287bb-b2e3-4378-a5d9-9285eb009506',
            pickupDateTime: 'today',
            dropOffDateTime: 'tomorrow',
            car: {
                id: '7c9d312e-77d0-4d20-926f-b0062b188d19',
                model: {
                    id: 'c7bacec0-4e80-4cd5-9c0d-6869696a6331',
                    name: 'Aston Martin V8'
                },
            },
            totalPrice: '900€',
        },
        query: {
            customer: {
                email: 'james.bond@mi6.com',
            }
        }
    }
])('Scenario: A simple car rental retrieval ' +
    'Given I am logged in as customer $query.customer.email ' +
    'And I have booked a $carRental.car.model.name to be picked up at $carRental.pickupDateTime and dropped off at $carRental.dropOffDateTime ' +
    'And the total price for my car rental is $carRental.totalPrice ' +
    'When I retrieve car rental with ID $carRental.id ', (testCase) => {
    let uc: RetrieveACarRental;
    let expectedCarRental: Partial<CarRentalDTO>;
    let dateParser: DateParser;
    let query: RetrieveACarRentalQuery;

    beforeAll(() => {
        advanceTo(Date.now());
        useTestingUtilities();
        dateParser = container.resolve("DateParser");
    });

    beforeEach(async () => {
        useInMemoryRepositories();
        const unitOfWork: UnitOfWork = container.resolve("UnitOfWork");
        const transactionManager: TransactionManagerInterface = container.resolve("TransactionManagerInterface");
        const transaction: TransactionInterface = transactionManager.newTransaction();
        const totalPrice = convertToNumericPrice(testCase.carRental.totalPrice);
        await populateCarRental({
            id: testCase.carRental.id,
            carId: testCase.carRental.car.id,
            modelId: testCase.carRental.car.model.id,
            pickupDateTime: dateParser.parse(testCase.carRental.pickupDateTime),
            dropOffDateTime: dateParser.parse(testCase.carRental.dropOffDateTime),
            customerId: testCase.carRental.customerId,
            totalPrice
        }, unitOfWork);
        await populateCarModel({
            id: testCase.carRental.car.model.id,
            dailyRate: 0,
        }, unitOfWork);
        await transaction.commit();
        const carRentalReadRepository: InMemoryCarRentalReadRepository = container.resolve("CarRentalReadRepositoryInterface");
        uc = new RetrieveACarRental({
            carRentalReadRepository,
        });
        query = {
            id: testCase.carRental.id
        }
        expectedCarRental = {
            id: testCase.carRental.id,
            customerId: testCase.carRental.customerId,
            pickupDateTime: dateParser.parse(testCase.carRental.pickupDateTime),
            dropOffDateTime: dateParser.parse(testCase.carRental.dropOffDateTime),
            totalPrice,
            car: {
                id: testCase.carRental.car.id,
                model: {
                    id: testCase.carRental.car.model.id,
                    dailyRate: 0,
                }
            }
        }
    })

    it(`Then it should return one car rental with ID ${testCase.carRental.id}`, async () => {
        const carRental = await uc.execute(query);
        expect(carRental).toEqual(expectedCarRental);
    })
})