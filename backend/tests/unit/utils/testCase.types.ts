export type CarModelTestCaseEntry = {
    name: string | undefined;
    id: string;
    dailyRate: string | undefined;
    startDate: string;
    endDate: string;
    customerId: string | undefined;
};

export type CarTestCaseEntry = {
    id: string;
    model: CarModelTestCaseEntry;
    rentals: Array<CarModelTestCaseEntry>;
};

