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

    // EXERCISE #2: MISSING CODE HERE

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