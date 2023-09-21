import Car from '../../model';

export default interface CarReadRepositoryInterface {
    getOneAvailableCar({modelId}: { modelId: string }): Promise<Car>;
}