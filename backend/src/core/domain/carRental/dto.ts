import CarDTO from '../car/dto';

type CarRentalDTO = {
    id: string;
    customerId: string;
    car: CarDTO;
    totalPrice: number;
    pickupDateTime: Date;
    dropOffDateTime: Date;
}

export default CarRentalDTO;