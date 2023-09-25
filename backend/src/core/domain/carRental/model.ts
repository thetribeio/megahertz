import CarRentalDTO from './dto';
import Car from '../car/model';
import {intervalToDuration} from "date-fns";

export default class CarRental {
    private readonly id: string;
    private readonly car: Car;
    private readonly customerId: string;
    private totalPrice: number;
    private readonly startDate: Date;
    private readonly endDate: Date;

    constructor({
                    id,
                    car,
                    customerId,
                    totalPrice,
                    startDate,
                    endDate,
    }: {
        id: string,
        car: Car,
        customerId: string,
        totalPrice: number,
        startDate: Date,
        endDate: Date,
    }) {
        this.id = id;
        this.car = car;
        this.customerId = customerId;
        this.totalPrice = totalPrice;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    computeTotalPrice() {
        const duration = intervalToDuration({
            start: this.startDate,
            end: this.endDate,
        });
        this.totalPrice = this.car.computePrice(duration.days as number);
    }

    toDTO(): CarRentalDTO {
        return {
            id: this.id,
            customerId: this.customerId,
            car: this.car.toDTO(),
            totalPrice: this.totalPrice,
            startDate: this.startDate,
            endDate: this.endDate,
        }
    }
}