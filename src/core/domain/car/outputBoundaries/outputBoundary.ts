export type CarRentalPlanningDTO = {
    id: string;
    pickupDateTime: Date;
    dropOffDateTime: Date;
}

export type CarPlanningDTO = {
    rentals: CarRentalPlanningDTO[]
};

type CarPlanningGroupType = {
    [key: string]: CarPlanningDTO;
}

type CarsPlanningDTO = {
    cars: CarPlanningGroupType;
};

export default CarsPlanningDTO;

