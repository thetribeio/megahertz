import "reflect-metadata";
import {container} from "tsyringe";
import DateParser from "tests/utils/dateParser";
import {faker} from "@faker-js/faker";
import {advanceTo} from "jest-date-mock";
import {v4} from "uuid";
import useTestingUtilities from "tests/configuration/containers/utils";
import CarsPlanningDTO from "src/core/domain/car/outputBoundaries/outputBoundary";
import RetrieveCarsPlanning from "src/core/useCases/car/query/retrieveCarsPlanning/handler";
import useInMemoryRepositories from "src/configuration/injection/containers/repositories/inMemory";
import {CarTestCaseEntry} from "tests/unit/utils/testCase.types";
import {populateCarsAndCarRentalsFromTestCase} from "tests/unit/utils/populateFromTestCase";
import TransactionManagerInterface from "src/core/domain/common/interfaces/transactionManager";
import TransactionInterface from "src/core/domain/common/interfaces/transaction";
import UnitOfWork from "src/driven/repositories/inMemory/common/unitOfWork";
import {populateCarModel} from "tests/unit/utils/populate";

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
            endDate: 'next sunday',
        },
        models: [
            {
                id: '086e0785-b788-479d-a2b2-a193f9805859',
                name: 'Aston Martin V8',
            }
        ],
        cars: [
            {
                id: '91748630-cd29-483b-8f01-a3b74abf3286',
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
            }
        ] as CarTestCaseEntry[],
        numCars: 1,
        numRentals: 1,
    },
    {
        query: {
            actor: {
                email: faker.internet.email({provider: "megahertz.com"}),
            },
            agency: {
                name: 'MegaHertz Paris Opera',
            },
            startDate: 'today',
            endDate: 'next sunday',
        },
        models: [
            {
                id: '086e0785-b788-479d-a2b2-a193f9805859',
                name: 'Aston Martin V8',
            }
        ],
        cars: [
            {
                id: v4(),
                model: {
                    id: '086e0785-b788-479d-a2b2-a193f9805859',
                },
                rentals: [
                    {
                        id: v4(),
                        pickupDateTime: 'tomorrow',
                        dropOffDateTime: 'in 3 days',
                    }
                ],
            }
        ] as CarTestCaseEntry[],
        numCars: 1,
        numRentals: 1,
    },
    {
        query: {
            actor: {
                email: faker.internet.email({provider: "megahertz.com"}),
            },
            agency: {
                name: 'MegaHertz Paris Opera',
            },
            startDate: 'today',
            endDate: 'next sunday',
        },
        models: [
            {
                id: '086e0785-b788-479d-a2b2-a193f9805859',
                name: 'Aston Martin V8',
            }
        ],
        cars: [
            {
                id: v4(),
                model: {
                    id: '086e0785-b788-479d-a2b2-a193f9805859',
                },
                rentals: [
                    {
                        id: v4(),
                        pickupDateTime: 'today',
                        dropOffDateTime: 'tomorrow',
                    }
                ],
            },
            {
                id: v4(),
                model: {
                    id: '086e0785-b788-479d-a2b2-a193f9805859',
                },
                rentals: [
                    {
                        id: v4(),
                        pickupDateTime: 'today',
                        dropOffDateTime: 'tomorrow',
                    }
                ],
            }
        ] as CarTestCaseEntry[],
        numCars: 2,
        numRentals: 2,
    },
    {
        query: {
            actor: {
                email: faker.internet.email({provider: "megahertz.com"}),
            },
            agency: {
                name: 'MegaHertz Paris Opera',
            },
            startDate: 'today',
            endDate: 'next sunday',
        },
        models: [
            {
                id: '086e0785-b788-479d-a2b2-a193f9805859',
                name: 'Aston Martin V8',
            }
        ],
        cars: [
            {
                id: v4(),
                model: {
                    id: '086e0785-b788-479d-a2b2-a193f9805859',
                },
                rentals: [
                    {
                        id: v4(),
                        pickupDateTime: 'today',
                        dropOffDateTime: 'tomorrow',
                    },
                    {
                        id: v4(),
                        pickupDateTime: 'tomorrow',
                        dropOffDateTime: 'after tomorrow',
                    }
                ],
            },
            {
                id: v4(),
                model: {
                    id: '086e0785-b788-479d-a2b2-a193f9805859',
                },
                rentals: [
                    {
                        id: v4(),
                        pickupDateTime: 'today',
                        dropOffDateTime: 'tomorrow',
                    }
                ],
            }
        ] as CarTestCaseEntry[],
        numCars: 2,
        numRentals: 3,
    }
])(
    "Given I am logged in as front desk employee $query.actor.email from agency $query.agency.name " +
    "And I have $numCars car(s) " +
    "And I have $numRentals reservation(s) " +
    "When I retrieve the planning for agency $query.agency.name from $query.startDate until $query.endDate ", (testCase) => {
        let uc: RetrieveCarsPlanning;
        let expectedPlanning: CarsPlanningDTO;
        let dateParser: DateParser;

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
                carReadRepository: container.resolve("CarReadRepositoryInterface")
            });
            expectedPlanning = {
                cars: {}
            }
            for (const carTestCaseEntry of testCase.cars){
                expectedPlanning.cars[carTestCaseEntry.id] = {
                    rentals: []
                }
                for (const rentalEntry of carTestCaseEntry.rentals){
                    expectedPlanning.cars[carTestCaseEntry.id].rentals.push(
                        {
                            id: rentalEntry.id,
                            pickupDateTime: dateParser.parse(rentalEntry.pickupDateTime),
                            dropOffDateTime: dateParser.parse(rentalEntry.dropOffDateTime),
                        }
                    )
                }
            }
        })

        it(`Then It should return a list of ${testCase.numCars} car(s) with ${testCase.numRentals} car rental(s)`, async () => {
            const retrievedPlanning = await uc.execute();
            expect(retrievedPlanning).toEqual(expectedPlanning);
        })
    })