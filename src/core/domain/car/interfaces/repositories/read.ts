import Car from '../../model';

export default interface CarReadRepositoryInterface {
    getOneAvailableCar({
                           modelId,
                           pickupDateTime,
                           dropOffDateTime
                       }: { modelId: string, pickupDateTime: Date, dropOffDateTime: Date }): Promise<Car>;
}