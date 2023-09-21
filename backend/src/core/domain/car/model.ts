import CarDTO from './dto';

export default class Car {
    private readonly id: string;

    constructor({id}:{id: string}) {
        this.id = id;
    }

    toDTO(): CarDTO {
        return {
            id: this.id,
        };
    }
}