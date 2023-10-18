type Actor = {
    id: string;
}

type RetrieveCarsPlanningQuery = {
    startDate: Date;
    endDate: Date;
    limit: number;
    cursor: string;
    actor: Actor;
};

export default RetrieveCarsPlanningQuery;