type RetrieveCarsPlanningQuery = {
    startDate: Date;
    endDate: Date;
    limit: number;
    cursor: string;
};

export default RetrieveCarsPlanningQuery;