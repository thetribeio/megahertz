import CarRentalDTO from './dto';
import Car from '../car/model';
import {intervalToDuration} from 'date-fns';

export default class CarRental {
    private readonly id: string;

    private readonly car: Car;

    private readonly customerId: string;

    private totalPrice: number;

    private readonly pickupDateTime: Date;

    private readonly dropOffDateTime: Date;

    constructor({
                    id,
                    car,
                    customerId,
                    totalPrice,
                    pickupDateTime,
                    dropOffDateTime,
                }: {
        id: string,
        car: Car,
        customerId: string,
        totalPrice: number,
        pickupDateTime: Date,
        dropOffDateTime: Date,
    }) {
        this.id = id;
        this.car = car;
        this.customerId = customerId;
        this.totalPrice = totalPrice;
        this.pickupDateTime = pickupDateTime;
        this.dropOffDateTime = dropOffDateTime;
    }

    // EXERCISE #2: MISSING CODE HERE

    /**
     * Returns a car rental DTO (Data Transfer Object)
     *
     * @return {CarRentalDTO} The frozen car rental DTO.
     */
    toDTO(): CarRentalDTO {
        const carRentalDTO = {
            id: this.id,
            customerId: this.customerId,
            car: this.car.toDTO(),
            totalPrice: this.totalPrice,
            pickupDateTime: this.pickupDateTime,
            dropOffDateTime: this.dropOffDateTime,
        }

        return Object.freeze(carRentalDTO);
    }
}