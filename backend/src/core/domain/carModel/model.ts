import CarModelDTO from './dto';

export default class CarModel {
    private readonly id: string;

    private readonly dailyRate: number;

    constructor(
        {
            id,
            dailyRate,
        }: {
            id: string,
            dailyRate: number,
        }
    ) {
        this.id = id;
        this.dailyRate = dailyRate;
    }

    /**
     * Returns a car model DTO (Data Transfer Object)
     *
     * @return {CarModelDTO} The frozen car model DTO.
     */
    toDTO(): CarModelDTO {
        const carModelDTO = {
            id: this.id,
            dailyRate: this.dailyRate
        }

        return Object.freeze(carModelDTO);
    }
}