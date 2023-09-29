type InMemoryCarRental = {
    id: string;
    carId: string;
    modelId: string;
    pickupDateTime: Date;
    dropOffDateTime: Date;
    customerId: string;
    totalPrice: number;
}

export default InMemoryCarRental;