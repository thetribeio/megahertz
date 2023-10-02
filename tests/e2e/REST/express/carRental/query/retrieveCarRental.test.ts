import 'reflect-metadata';
import {v4} from 'uuid';
import {container} from 'tsyringe';
import {advanceTo} from 'jest-date-mock';
import supertest from 'supertest';
import express from 'express';
import http from 'http';
import createApp from '../../../../../../src/configuration/driving/REST/express/app';
import CarRentalView from '../../../../../../src/driving/views/carRental/base';
import DateParser from '../../../../../utils/dateParser';
import useTestingUtilities from '../../../../../configuration/containers/utils';
import {startServer} from '../../utils/setup';
import useTypeORMRepositories from '../../../../../../src/configuration/injection/containers/repositories/typeorm';
import AppDataSource from '../../../../../../src/configuration/database/typeorm/data-source';
import TypeORMCustomerFactory from '../../../../../integration/typeorm/seeding/factories/customer';
import TypeORMCarModelFactory from '../../../../../integration/typeorm/seeding/factories/carModel';
import TypeORMCarFactory from '../../../../../integration/typeorm/seeding/factories/car';
import TypeORMCarRentalFactory from '../../../../../integration/typeorm/seeding/factories/carRental';


describe.each([
    {
        rental: {
            id: '48e6436f-100f-41f5-a82d-9fb3dd6386d2',
            customerId: '25f3b274-ea40-4d3f-be27-c11b2ac9367b',
            car: {
                id: '987a6407-7b80-4381-9811-78a939cb7545',
                model: {
                    id: '28837cd2-512c-4212-b934-c10d36ddfd7f',
                    dailyRate: 100,
                }
            },
            totalPrice: 100,
            pickupDateTime: 'today',
            dropOffDateTime: 'today',
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
            pickupDateTime: 'yesterday',
            dropOffDateTime: 'tomorrow',
        }
    },
])("GET /car-rentals/$rental.id", (testCase) => {
    let expectedCarRentalView: CarRentalView;
    let dateParser: DateParser;
    let expressApp: express.Express;
    let server: http.Server;

    beforeAll(() => {
        advanceTo(Date.now());
        useTestingUtilities();
        useTypeORMRepositories();
        dateParser = container.resolve("DateParser");
        expressApp = createApp();
        server = startServer(expressApp);
    })

    beforeEach(async () => {
        await AppDataSource.initialize();
        await AppDataSource.synchronize();
        const customer = await new TypeORMCustomerFactory().create({
            id: testCase.rental.customerId,
        });
        const model = await new TypeORMCarModelFactory().create({
            id: testCase.rental.car.model.id,
            dailyRate: testCase.rental.car.model.dailyRate,
        });
        const car = await new TypeORMCarFactory().create({
            id: testCase.rental.car.id,
            model
        });
        await new TypeORMCarRentalFactory().create({
            id: testCase.rental.id,
            totalPrice: testCase.rental.totalPrice,
            pickupDateTime: dateParser.parse(testCase.rental.pickupDateTime),
            dropOffDateTime: dateParser.parse(testCase.rental.dropOffDateTime),
            customer,
            car,
        });
        expectedCarRentalView = {
            id: testCase.rental.id,
            customer: {
                id: testCase.rental.customerId,
            },
            car: {
                id: testCase.rental.car.id,
                model: {
                    id: testCase.rental.car.model.id
                }
            },
            totalPrice: testCase.rental.totalPrice,
            pickupDateTime: dateParser.parse(testCase.rental.pickupDateTime).toISOString(),
            dropOffDateTime: dateParser.parse(testCase.rental.dropOffDateTime).toISOString(),
        }
    })

    afterEach(async () => {
        await AppDataSource.dropDatabase();
        await AppDataSource.destroy();
    })

    afterAll(async () => {
        await server.close();
    })

    it(`should respond with a presented car rental ${testCase.rental.id}`, async () => {
        await supertest(expressApp)
            .get(`/api/car-rentals/${testCase.rental.id}`)
            .expect(200)
            .then(async (res) => {
               expect(res.body).toEqual(expectedCarRentalView);
            });
    })
})