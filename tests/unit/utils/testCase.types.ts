export type CarModelTestCaseEntry = {
    name: string | undefined;
    id: string;
    dailyRate: string | undefined;
    pickupDateTime: string;
    dropOffDateTime: string;
    customerId: string | undefined;
};

export type CarTestCaseEntry = {
    id: string;
    model: CarModelTestCaseEntry;
    rentals: Array<CarModelTestCaseEntry>;
};

