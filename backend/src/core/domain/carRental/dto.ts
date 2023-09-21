import CarDTO from '../car/dto';

type CarRentalDTO = {
    customerId: string;
    car: CarDTO;
    totalPrice: number;
    startDate: Date;
}

export default CarRentalDTO;