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

    toDTO(): CarModelDTO {
        return {
            id: this.id,
            dailyRate: this.dailyRate
        }
    }
}