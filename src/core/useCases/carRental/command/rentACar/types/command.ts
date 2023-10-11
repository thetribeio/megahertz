type RentACarCommand = {
    customerId: string;
    carModelId: string;
    pickupDateTime: Date;
    dropOffDateTime: Date;
}

export default RentACarCommand;