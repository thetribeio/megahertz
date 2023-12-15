export type CarRentalTestCaseEntry = {
    id: string;
    pickupDateTime: string;
    dropOffDateTime: string;
    customerId: string;
    car: CarTestCaseEntry;
    totalPrice: number;
};

export type CarModelTestCaseEntry = {
    id: string;
    dailyRate: number;
}

export type CarTestCaseEntry = {
    id: string;
    model: CarModelTestCaseEntry;
};
