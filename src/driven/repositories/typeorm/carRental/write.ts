import CarRentalWriteRepositoryInterface from "src/core/domain/carRental/interfaces/repositories/write";
import CarRentalDTO from "src/core/domain/carRental/dto";
import {TypeORMCarRental} from "src/driven/repositories/typeorm/entities";
import {DataSource, QueryRunner} from "typeorm";
import {container, inject, singleton} from "tsyringe";

@singleton()
export default class TypeORMCarRentalWriteRepository implements CarRentalWriteRepositoryInterface {

    private readonly dataSource: DataSource;

    constructor(@inject("DataSource") dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    async create(carRentalDTO: CarRentalDTO): Promise<void> {
        const queryRunner: QueryRunner = container.resolve("CurrentQueryRunner");
        const typeORMCarRental = new TypeORMCarRental();
        typeORMCarRental.id = carRentalDTO.id;
        typeORMCarRental.totalPrice = carRentalDTO.totalPrice;
        typeORMCarRental.pickupDateTime = carRentalDTO.pickupDateTime;
        typeORMCarRental.dropOffDateTime = carRentalDTO.dropOffDateTime;
        typeORMCarRental.customer = {id: carRentalDTO.customerId};
        typeORMCarRental.car = <any>{id: carRentalDTO.car.id};

        await queryRunner.manager.save(typeORMCarRental);
    }

}