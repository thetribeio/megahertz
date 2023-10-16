export type CarRentalPlanningDTO = {
    id: string;
    pickupDateTime: Date;
    dropOffDateTime: Date;
}

export type CarPlanningDTO = {
    licensePlate: string;
    rentals: CarRentalPlanningDTO[];
};

type Cursor = {
    nextPage: null;
}

type CarPlanningGroupType = {
    [key: string]: CarPlanningDTO;
}

type CarsPlanningDTO = {
    cars: CarPlanningGroupType;
    cursor: Cursor;
};

export default CarsPlanningDTO;

