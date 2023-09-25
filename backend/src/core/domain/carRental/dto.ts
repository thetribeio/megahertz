import CarDTO from '../car/dto';

type CarRentalDTO = {
    id: string;
    customerId: string;
    car: CarDTO;
    totalPrice: number;
    startDate: Date;
    endDate: Date;
}

export default CarRentalDTO;