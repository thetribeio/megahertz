import CarRentalDTO from '../../dto';

export default interface CarRentalWriteRepositoryInterface {
    create(carRentalDTO: CarRentalDTO): Promise<void>
}