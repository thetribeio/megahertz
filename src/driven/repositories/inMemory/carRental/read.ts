import 'reflect-metadata';
import _ from 'lodash';
import {inject, injectable} from 'tsyringe';
import CarRentalReadRepositoryInterface from 'src/core/domain/carRental/interfaces/repositories/read';
import CarRental from 'src/core/domain/carRental/model';
import UnitOfWork from '../common/unitOfWork';
import Car from 'src/core/domain/car/model';
import InMemoryCarRental from './carRental.entity';
import CarModel from 'src/core/domain/carModel/model';
import InMemoryCarModel from '../carModel/carModel.entity';

@injectable()
export default class InMemoryCarRentalReadRepository implements CarRentalReadRepositoryInterface {
    private readonly unitOfWork: UnitOfWork;

    constructor(@inject("UnitOfWork") unitOfWork: UnitOfWork) {
        this.unitOfWork = unitOfWork;
    }

    async read(id: string): Promise<CarRental> {

    }

}