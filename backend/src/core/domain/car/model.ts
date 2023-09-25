import CarDTO from './dto';
import CarModel from '../carModel/model';

export default class Car {
    private readonly id: string;
    private readonly model: CarModel;

    constructor(
        {
            id,
            model,
        }:{
            id: string,
            model: CarModel,
        }) {
        this.id = id;
        this.model = model;
    }

    computePrice(durationInDays: number): number {
        const dailyRate = this.model.toDTO().dailyRate;

        return dailyRate * durationInDays;
    }

    toDTO(): CarDTO {
        return {
            id: this.id,
            modelId: this.model.toDTO().id,
        };
    }
}