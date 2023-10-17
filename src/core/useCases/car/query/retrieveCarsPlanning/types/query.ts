type RetrieveCarsPlanningQuery = {
    startDate: Date;
    endDate: Date;
    limit: number;
    cursor: null | string;
};

export default RetrieveCarsPlanningQuery;