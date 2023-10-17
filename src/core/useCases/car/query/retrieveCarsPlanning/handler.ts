import CarsPlanningDTO from "src/core/domain/car/outputBoundaries/outputBoundary";
import CarReadRepositoryInterface from "src/core/domain/car/interfaces/repositories/read";
import RetrieveCarsPlanningQuery from "src/core/useCases/car/query/retrieveCarsPlanning/types/query";
import RetrieveCarsPlanningAuthorizer from "src/core/useCases/car/query/retrieveCarsPlanning/authorizer";
import DecodedCursor from "src/core/domain/common/types/cursor";

export default class RetrieveCarsPlanning {
    private readonly carReadRepository;

    private readonly authorizer;

    constructor({
                    carReadRepository,
                    authorizer
                }: { carReadRepository: CarReadRepositoryInterface, authorizer: RetrieveCarsPlanningAuthorizer }) {
        this.carReadRepository = carReadRepository;
        this.authorizer = authorizer;
    }

    async execute(query: RetrieveCarsPlanningQuery): Promise<CarsPlanningDTO> {
        await this.authorizer.userMayRetrieveCarsPlanning();

        return await this.carReadRepository.getCarsPlanning({
            startDate: query.startDate,
            endDate: query.endDate,
            cursor: this.decodeCursor(query.cursor),
        });
    }

    private decodeCursor(cursor: null | string): DecodedCursor {
        if (cursor === null) {
            return {
                order: 'gte',
                address: ''
            }
        }
        const cursorMatch = atob(cursor).match(new RegExp('^(?<order>(next|prev)___)(?<address>[\\w\'-]+)$')) as RegExpMatchArray;
        const groups = cursorMatch.groups as any;
        return {
            order: groups.order == 'next' ? 'gte' : 'lte',
            address: groups.address as string,
        }
    }
}