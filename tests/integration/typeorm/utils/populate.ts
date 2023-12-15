import TypeORMCustomerFactory from "tests/integration/typeorm/seeding/factories/customer";
import TypeORMCarModelFactory from "tests/integration/typeorm/seeding/factories/carModel";
import {TypeORMCar, TypeORMCarModel, TypeORMCustomer} from "src/driven/repositories/typeorm/entities";
import TypeORMCarFactory from "tests/integration/typeorm/seeding/factories/car";

export const populateCustomer = async (
    {id}: { id: string }
): Promise<TypeORMCustomer> => {
    return await new TypeORMCustomerFactory().create({
        id
    });
}

export const populateCarModel = async (
    {id, dailyRate}: { id: string, dailyRate: number }
): Promise<TypeORMCarModel> => {
    return await new TypeORMCarModelFactory().create({
        id,
        dailyRate,
    });
}

export const populateCar = async (
    {id, model}: { id: string, model: TypeORMCarModel }
): Promise<TypeORMCar> => {
    return await new TypeORMCarFactory().create({
        id,
        model,
    });
}