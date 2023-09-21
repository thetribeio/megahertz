import {advanceTo, clear} from 'jest-date-mock';
import DateParser from '../../utils/dateParser';
import RentACar from '../../../src/core/useCases/carRental/rentACar/handler';
import RentACarCommand from '../../../src/core/useCases/carRental/rentACar/types/command';
import CarRentalDTO from '../../../src/core/domain/carRental/dto';
import CarDTO from '../../../src/core/domain/car/dto';
import CarReadRepositoryInterface from '../../../src/core/domain/car/interfaces/repositories/read';
import UnitOfWork from '../../../src/driven/repositories/inMemory/common/unitOfWork';
import InMemoryCarReadRepository from '../../../src/driven/repositories/inMemory/car/read';
import InMemoryCar from '../../../src/driven/repositories/inMemory/car/car.entity';

const convertToNumericPrice = (price: string): number => {
    const split = price.split("€");

    return Number(split[0]);
}

describe.each([
    {
        customer: {
            id: 'd004b603-d424-4a84-8e49-4868587659c3',
            name: 'Frank Castle',
        },
        availableCar: {
            id: 'db9bf6a2-b10e-4b48-a946-543643284532',
            model: 'Ford E-Series 4x4 Van',
            modelId: '8db13c9d-31af-4c9e-8456-9aafa00a9f76',
            dailyPrice: '249€',
            availableUntil: 'next saturday'
        },
        command: {
            startDate: 'tomorrow',
            duration: '5 days',
        },
        expectedCarRental: {
            totalPrice: '1245€'
        }
    },
    {
        customer: {
            id: 'aa7c24d4-dd6a-4607-8946-ec5cd8f52281',
            name: 'Walt Kowalski',
        },
        availableCar: {
            id: '18cc7fb0-b9fa-48bd-be26-585b070df6a3',
            model: 'Ford E-Series 4x4 Van',
            modelId: '230c974a-746a-47a5-b958-0c54f52c0620',
            dailyPrice: '249€',
            availableUntil: 'next saturday'
        },
        command: {
            startDate: 'tomorrow',
            duration: '5 days',
        },
        expectedCarRental: {
            totalPrice: '1245€'
        }
    }
])('$customer.name rents a $command.car.model', function (testCase) {
    let uc: RentACar;
    let expectedCar: CarDTO;
    let expectedCarRental: CarRentalDTO;
    let dateParser: DateParser;
    let command: RentACarCommand;
    let unitOfWork: UnitOfWork;
    let carReadRepository: CarReadRepositoryInterface;

    beforeAll(() => {
        advanceTo(Date.now());
        dateParser = new DateParser();
    });

    beforeEach(() => {
        unitOfWork = new UnitOfWork();
        unitOfWork.cars[testCase.availableCar.id] = {
            id: testCase.availableCar.id,
            modelId: testCase.availableCar.modelId,
        } as InMemoryCar;
        carReadRepository = new InMemoryCarReadRepository({
            unitOfWork
        });
        uc = new RentACar({
            carReadRepository,
        });
        command = {
            customerId: testCase.customer.id,
            carModelId: testCase.availableCar.modelId,
        }
        expectedCar = {
            id: testCase.availableCar.id
        }
        expectedCarRental = {
            customerId: testCase.customer.id,
            car: expectedCar,
            totalPrice: convertToNumericPrice(testCase.expectedCarRental.totalPrice),
            startDate: dateParser.parse(testCase.command.startDate),
        };
    })

    it('Scenario: A simple car rental\n' +
        'Given I am logged in as customer $customer.name\n' +
        'And there is 1 $availableCar.model in the system\n' +
        'And the daily price for a $availableCar.model is $availableCar.dailyPrice\n' +
        'And the $availableCar.model is available until $availableCar.availableUntil\n' +
        'When I rent a $availableCar.model for $command.duration days starting $command.startDate\n' +
        'Then it should create a new car rental in the system for a total price of $expectedCarRental.totalPrice', async () => {
        const carRental = await uc.execute(command);
        expect(carRental).toEqual(expectedCarRental);
    })
});