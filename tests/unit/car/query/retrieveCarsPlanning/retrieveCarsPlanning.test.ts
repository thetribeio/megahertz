import "reflect-metadata";
import {container} from "tsyringe";
import DateParser from "tests/utils/dateParser";
import {faker} from "@faker-js/faker";
import {advanceTo} from "jest-date-mock";
import {v4} from "uuid";
import _ from "lodash";
import useTestingUtilities from "tests/configuration/containers/utils";
import CarsPlanningDTO from "src/core/domain/car/outputBoundaries/outputBoundary";
import RetrieveCarsPlanning from "src/core/useCases/car/query/retrieveCarsPlanning/handler";
import useInMemoryRepositories from "src/configuration/injection/containers/repositories/inMemory";
import {CarTestCaseEntry} from "tests/unit/utils/testCase.types";
import {populateCarsAndCarRentalsFromTestCase} from "tests/unit/utils/populateFromTestCase";
import TransactionManagerInterface from "src/core/domain/common/interfaces/transactionManager";
import TransactionInterface from "src/core/domain/common/interfaces/transaction";
import UnitOfWork from "src/driven/repositories/inMemory/common/unitOfWork";
import {populateCarModel, populateCarRental} from "tests/unit/utils/populate";
import RetrieveCarsPlanningQuery from "src/core/useCases/car/query/retrieveCarsPlanning/types/query";
import UserIsNotAuthorizedToRetrieveCarsPlanningError from "src/core/useCases/car/query/retrieveCarsPlanning/exceptions/notAuthorized";
import PermissionsStubGateway from "tests/common/stubs/gateways/permissions/allow";
import RetrieveCarsPlanningAuthorizer from "src/core/useCases/car/query/retrieveCarsPlanning/authorizer";
import PermissionsDenyStubGateway from "tests/common/stubs/gateways/permissions/deny";
import {buildExpectedCarsPlanning} from "tests/unit/car/query/retrieveCarsPlanning/beforeEach";
import {buildCarTestCase} from "tests/unit/car/query/retrieveCarsPlanning/each";

// describe.each([
//     {
//         query: {
//             actor: {
//                 email: faker.internet.email({provider: "megahertz.com"}),
//             },
//             agency: {
//                 name: 'MegaHertz Paris Opera',
//             },
//             startDate: 'today',
//             endDate: 'in 10 days',
//         },
//         models: [
//             {
//                 id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 name: 'Aston Martin V8',
//             }
//         ],
//         cars: [
//             {
//                 id: '91748630-cd29-483b-8f01-a3b74abf3286',
//                 model: {
//                     id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 },
//                 rentals: [
//                     {
//                         id: '080cf232-38c8-4caa-ad7e-c5d401b3b9de',
//                         pickupDateTime: 'today',
//                         dropOffDateTime: 'in 2 days',
//                     }
//                 ],
//             }
//         ] as CarTestCaseEntry[],
//         rentalsOutsideOfStartDateEndDate: [],
//         numCars: 1,
//         numRentals: 1,
//     },
//     {
//         query: {
//             actor: {
//                 email: faker.internet.email({provider: "megahertz.com"}),
//             },
//             agency: {
//                 name: 'MegaHertz Paris Opera',
//             },
//             startDate: 'today',
//             endDate: 'in 10 days',
//         },
//         models: [
//             {
//                 id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 name: 'Aston Martin V8',
//             }
//         ],
//         cars: [
//             {
//                 id: v4(),
//                 model: {
//                     id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 },
//                 rentals: [
//                     {
//                         id: v4(),
//                         pickupDateTime: 'tomorrow',
//                         dropOffDateTime: 'in 3 days',
//                     }
//                 ],
//             }
//         ] as CarTestCaseEntry[],
//         rentalsOutsideOfStartDateEndDate: [],
//         numCars: 1,
//         numRentals: 1,
//     },
//     {
//         query: {
//             actor: {
//                 email: faker.internet.email({provider: "megahertz.com"}),
//             },
//             agency: {
//                 name: 'MegaHertz Paris Opera',
//             },
//             startDate: 'today',
//             endDate: 'in 10 days',
//         },
//         models: [
//             {
//                 id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 name: 'Aston Martin V8',
//             }
//         ],
//         cars: [
//             {
//                 id: v4(),
//                 model: {
//                     id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 },
//                 rentals: [
//                     {
//                         id: v4(),
//                         pickupDateTime: 'today',
//                         dropOffDateTime: 'tomorrow',
//                     }
//                 ],
//             },
//             {
//                 id: v4(),
//                 licensePlate: 'AB-123-AA',
//                 model: {
//                     id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 },
//                 rentals: [
//                     {
//                         id: v4(),
//                         pickupDateTime: 'today',
//                         dropOffDateTime: 'tomorrow',
//                     }
//                 ],
//             }
//         ] as CarTestCaseEntry[],
//         rentalsOutsideOfStartDateEndDate: [],
//         numCars: 2,
//         numRentals: 2,
//     },
//     {
//         query: {
//             actor: {
//                 email: faker.internet.email({provider: "megahertz.com"}),
//             },
//             agency: {
//                 name: 'MegaHertz Paris Opera',
//             },
//             startDate: 'today',
//             endDate: 'in 10 days',
//         },
//         models: [
//             {
//                 id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 name: 'Aston Martin V8',
//             }
//         ],
//         cars: [
//             {
//                 id: v4(),
//                 model: {
//                     id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 },
//                 rentals: [
//                     {
//                         id: v4(),
//                         pickupDateTime: 'today',
//                         dropOffDateTime: 'tomorrow',
//                     },
//                     {
//                         id: v4(),
//                         pickupDateTime: 'tomorrow',
//                         dropOffDateTime: 'after tomorrow',
//                     }
//                 ],
//             },
//             {
//                 id: v4(),
//                 licensePlate: 'AC-123-AA',
//                 model: {
//                     id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 },
//                 rentals: [
//                     {
//                         id: v4(),
//                         pickupDateTime: 'today',
//                         dropOffDateTime: 'tomorrow',
//                     }
//                 ],
//             }
//         ] as CarTestCaseEntry[],
//         rentalsOutsideOfStartDateEndDate: [],
//         numCars: 2,
//         numRentals: 3,
//     },
//     {
//         query: {
//             actor: {
//                 email: faker.internet.email({provider: "megahertz.com"}),
//             },
//             agency: {
//                 name: 'MegaHertz Paris Opera',
//             },
//             startDate: 'today',
//             endDate: 'in 8 days',
//         },
//         models: [
//             {
//                 id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 name: 'Aston Martin V8',
//             }
//         ],
//         cars: [
//             {
//                 id: '24602883-4cf5-4276-9e48-d46e2008a7e8',
//                 model: {
//                     id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 },
//                 rentals: [
//                     {
//                         id: v4(),
//                         pickupDateTime: 'today',
//                         dropOffDateTime: 'tomorrow',
//                     },
//                 ],
//             }
//         ] as CarTestCaseEntry[],
//         rentalsOutsideOfStartDateEndDate: [
//             {
//                 carId: '24602883-4cf5-4276-9e48-d46e2008a7e8',
//                 modelId: '086e0785-b788-479d-a2b2-a193f9805859',
//                 pickupDateTime: '2 days ago',
//                 dropOffDateTime: 'yesterday',
//             },
//             {
//                 carId: '24602883-4cf5-4276-9e48-d46e2008a7e8',
//                 modelId: '086e0785-b788-479d-a2b2-a193f9805859',
//                 pickupDateTime: 'in 9 days',
//                 dropOffDateTime: 'in 10 days',
//             },
//             {
//                 carId: '24602883-4cf5-4276-9e48-d46e2008a7e8',
//                 modelId: '086e0785-b788-479d-a2b2-a193f9805859',
//                 pickupDateTime: 'in 10 days',
//                 dropOffDateTime: 'in 11 days',
//             }
//         ],
//         numCars: 1,
//         numRentals: 1,
//     },
//     {
//         query: {
//             actor: {
//                 email: faker.internet.email({provider: "megahertz.com"}),
//             },
//             agency: {
//                 name: 'MegaHertz Paris Opera',
//             },
//             startDate: 'in 2 days',
//             endDate: 'in 14 days',
//         },
//         models: [
//             {
//                 id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 name: 'Aston Martin V8',
//             }
//         ],
//         cars: [
//             {
//                 id: '24602883-4cf5-4276-9e48-d46e2008a7e8',
//                 model: {
//                     id: '086e0785-b788-479d-a2b2-a193f9805859',
//                 },
//                 rentals: [
//                     {
//                         id: v4(),
//                         pickupDateTime: 'in 2 days',
//                         dropOffDateTime: 'in 3 days',
//                     },
//                 ],
//             }
//         ] as CarTestCaseEntry[],
//         rentalsOutsideOfStartDateEndDate: [
//             {
//                 carId: '24602883-4cf5-4276-9e48-d46e2008a7e8',
//                 modelId: '086e0785-b788-479d-a2b2-a193f9805859',
//                 pickupDateTime: 'today',
//                 dropOffDateTime: 'tomorrow',
//             },
//         ],
//         numCars: 1,
//         numRentals: 1,
//     },
// ])(
//     "Given I am logged in as front desk employee $query.actor.email from agency $query.agency.name " +
//     "And I have $numCars car(s) " +
//     "And I have $numRentals reservation(s) " +
//     "When I retrieve the planning for agency $query.agency.name from $query.startDate until $query.endDate ", (testCase) => {
//         let uc: RetrieveCarsPlanning;
//         let expectedPlanning: CarsPlanningDTO;
//         let dateParser: DateParser;
//         let query: RetrieveCarsPlanningQuery;
//
//         beforeAll(() => {
//             advanceTo(Date.now());
//             useTestingUtilities();
//             dateParser = container.resolve("DateParser");
//         });
//
//         beforeEach(async () => {
//             useInMemoryRepositories();
//             const transactionManager: TransactionManagerInterface = container.resolve("TransactionManagerInterface");
//             const transaction: TransactionInterface = transactionManager.newTransaction();
//             const unitOfWork: UnitOfWork = container.resolve("UnitOfWork");
//             await populateCarModel({
//                 id: testCase.models[0].id,
//                 dailyRate: 0,
//             }, unitOfWork);
//             for (const carRental of testCase.rentalsOutsideOfStartDateEndDate) {
//                 await populateCarRental({
//                     id: v4(),
//                     carId: carRental.carId,
//                     modelId: carRental.modelId,
//                     pickupDateTime: dateParser.parse(carRental.pickupDateTime),
//                     dropOffDateTime: dateParser.parse(carRental.dropOffDateTime),
//                     customerId: v4(),
//                     totalPrice: 0,
//                 }, unitOfWork);
//             }
//             await populateCarsAndCarRentalsFromTestCase(testCase.cars);
//             await transaction.commit();
//             uc = new RetrieveCarsPlanning({
//                 carReadRepository: container.resolve("CarReadRepositoryInterface"),
//                 authorizer: new RetrieveCarsPlanningAuthorizer({
//                     permissionsGateway: new PermissionsStubGateway([]),
//                 }),
//             });
//             expectedPlanning = buildExpectedCarsPlanning(testCase.cars);
//             query = {
//                 startDate: dateParser.parse(testCase.query.startDate),
//                 endDate: dateParser.parse(testCase.query.endDate),
//                 limit: 5,
//                 cursor: '',
//             }
//         })
//
//         test(`Then It should return a list of ${testCase.numCars} car(s) with ${testCase.numRentals} car rental(s)`, async () => {
//             const retrievedPlanning = await uc.execute(query);
//             expect(retrievedPlanning).toEqual(expectedPlanning);
//         })
//     })

describe.each([
    {
        query: {
            actor: {
                email: faker.internet.email({provider: "megahertz.com"}),
            },
            agency: {
                name: 'MegaHertz Paris Opera',
            },
            startDate: 'today',
            endDate: 'in 10 days',
            limit: 5,
        },
        models: [
            {
                id: '086e0785-b788-479d-a2b2-a193f9805859',
                name: 'Aston Martin V8',
            }
        ],
        cars: _.orderBy([
            {
                id: v4(),
                model: {
                    id: '086e0785-b788-479d-a2b2-a193f9805859',
                },
                rentals: [
                    {
                        id: '080cf232-38c8-4caa-ad7e-c5d401b3b9de',
                        pickupDateTime: 'today',
                        dropOffDateTime: 'in 2 days',
                    }
                ],
            },
            buildCarTestCase({id: v4()}),
            buildCarTestCase({id: v4()}),
            buildCarTestCase({id: v4()}),
            buildCarTestCase({id: v4()}),
            buildCarTestCase({id: v4()}),
            buildCarTestCase({id: v4()}),
            buildCarTestCase({id: v4()}),
            buildCarTestCase({id: v4()}),
            buildCarTestCase({id: v4()}),
        ] as CarTestCaseEntry[], ['licensePlate'], ['asc']),
        numCars: 10,
        numRentals: 1,
    },
])(
    "Given I am logged in as front desk employee $query.actor.email from agency $query.agency.name " +
    "And I have $numCars car(s) " +
    "And I have $numRentals reservation(s) " +
    "When I retrieve the planning for agency $query.agency.name from $query.startDate until $query.endDate ", (testCase) => {
        let uc: RetrieveCarsPlanning;
        let expectedPlanning: CarsPlanningDTO;
        let dateParser: DateParser;
        let query: RetrieveCarsPlanningQuery;

        beforeAll(() => {
            advanceTo(Date.now());
            useTestingUtilities();
            dateParser = container.resolve("DateParser");
        });

        beforeEach(async () => {
            useInMemoryRepositories();
            const transactionManager: TransactionManagerInterface = container.resolve("TransactionManagerInterface");
            const transaction: TransactionInterface = transactionManager.newTransaction();
            const unitOfWork: UnitOfWork = container.resolve("UnitOfWork");
            await populateCarModel({
                id: testCase.models[0].id,
                dailyRate: 0,
            }, unitOfWork);
            await populateCarsAndCarRentalsFromTestCase(testCase.cars);
            await transaction.commit();
            uc = new RetrieveCarsPlanning({
                carReadRepository: container.resolve("CarReadRepositoryInterface"),
                authorizer: new RetrieveCarsPlanningAuthorizer({
                    permissionsGateway: new PermissionsStubGateway([]),
                }),
            });
        })

        test(`Then It should return a list of ${testCase.numCars} car(s) with ${testCase.numRentals} car rental(s)`, async () => {
            const numExecutions = testCase.numCars / testCase.query.limit;
            for (let i = 0; i < numExecutions; i++) {
                let cursor = i == 0 ? '' : `${testCase.cars[testCase.query.limit].licensePlate}`;
                expectedPlanning = buildExpectedCarsPlanning(testCase.cars.slice((i * testCase.query.limit), ((i + 1) * testCase.query.limit)));
                query = {
                    startDate: dateParser.parse(testCase.query.startDate),
                    endDate: dateParser.parse(testCase.query.endDate),
                    limit: testCase.query.limit,
                    cursor
                }
                let retrievedPlanning = await uc.execute(query);
                expect(retrievedPlanning).toEqual(expectedPlanning);
            }
        })
    })

// describe.each([
//     {
//         query: {
//             actor: {
//                 email: faker.internet.email({provider: "megahertz.com"}),
//             },
//             agency: {
//                 id: '675a4192-f81e-45c9-ac9d-10bdfd02591a',
//                 name: 'MegaHertz Paris Opera',
//             },
//         },
//         models: [],
//         cars: [] as CarTestCaseEntry[],
//         rentalsOutsideOfStartDateEndDate: [],
//     },
// ])("Given I am not logged in as a front desk employee from agency $query.agency.name " +
//     "When I retrieve the planning for agency $query.agency.name", () => {
//     let uc: RetrieveCarsPlanning;
//     let dateParser: DateParser;
//     let query: RetrieveCarsPlanningQuery;
//
//     beforeAll(() => {
//         advanceTo(Date.now());
//         useTestingUtilities();
//         dateParser = container.resolve("DateParser");
//     });
//
//     beforeEach(async () => {
//         useInMemoryRepositories();
//         uc = new RetrieveCarsPlanning({
//             carReadRepository: container.resolve("CarReadRepositoryInterface"),
//             authorizer: new RetrieveCarsPlanningAuthorizer({
//                 permissionsGateway: new PermissionsDenyStubGateway(),
//             }),
//         });
//         query = {
//             startDate: dateParser.parse("today"),
//             endDate: dateParser.parse("in 7 days"),
//             limit: 5,
//             cursor: '',
//         }
//     })
//
//     test("It should raise error UserIsNotAuthorizedToRetrieveCarsPlanningError", async () => {
//         await expect(uc.execute(query)).rejects.toThrow(
//             UserIsNotAuthorizedToRetrieveCarsPlanningError
//         );
//     })
// })