export type CarRentalTestCaseEntry = {
    id: string;
    pickupDateTime: string;
    dropOffDateTime: string;
    customerId: string | undefined;
};

export type CarModelTestCaseEntry = {
    id: string;
    name: string | undefined;
    dailyRate: string | undefined;
}

export type CarTestCaseEntry = {
    id: string;
    licensePlate: string | undefined;
    model: CarModelTestCaseEntry;
    rentals: Array<CarRentalTestCaseEntry>;
};

