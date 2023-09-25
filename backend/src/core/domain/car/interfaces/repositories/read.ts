import Car from '../../model';

export default interface CarReadRepositoryInterface {
    getOneAvailableCar({
                           modelId,
                           startDate,
                           endDate
                       }: { modelId: string, startDate: Date, endDate: Date }): Promise<Car>;
}