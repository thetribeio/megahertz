export type CarRentalPlanningDTO = {
    id: string;
    pickupDateTime: Date;
    dropOffDateTime: Date;
}

export type CarPlanningDTO = {
    rentals: CarRentalPlanningDTO[];
};

type Cursor = {
    nextPage: null | string;
}

type CarPlanningGroupType = {
    [key: string]: CarPlanningDTO;
}

type CarsPlanningDTO = {
    cars: CarPlanningGroupType;
    cursor: Cursor;
};

export default CarsPlanningDTO;

