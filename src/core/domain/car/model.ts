import CarDTO from './dto';
import CarModel from '../carModel/model';

/**
 * Domain model for Car.
 */
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

    /**
     * Computes a price, based on a number of days multiplied by the car model daily rate.
     *
     * @param {number} durationInDays The duration of the rental in days.
     *
     * @return {number} The computed price.
     */
    computePrice(durationInDays: number): number {
        const {dailyRate} = this.model.toDTO();

        return dailyRate * durationInDays;
    }

    /**
     * Returns a car DTO (Data Transfer Object)
     *
     * @return {CarDTO} The frozen car DTO.
     */
    toDTO(): CarDTO {
        const carDTO = {
            id: this.id,
            model: this.model.toDTO(),
        };

        return Object.freeze(carDTO);
    }
}