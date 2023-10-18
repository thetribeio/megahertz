import CarsPlanningDTO from "src/core/domain/car/outputBoundaries/outputBoundary";
import CarReadRepositoryInterface from "src/core/domain/car/interfaces/repositories/read";
import RetrieveCarsPlanningQuery from "src/core/useCases/car/query/retrieveCarsPlanning/types/query";
import RetrieveCarsPlanningAuthorizer from "src/core/useCases/car/query/retrieveCarsPlanning/authorizer";
import {decodeCursor} from "src/core/useCases/common/cursors/encodeDecode";

export default class RetrieveCarsPlanning {
    private readonly carReadRepository: CarReadRepositoryInterface;

    private readonly authorizer: RetrieveCarsPlanningAuthorizer;

    constructor({
                    carReadRepository,
                    authorizer
                }: { carReadRepository: CarReadRepositoryInterface, authorizer: RetrieveCarsPlanningAuthorizer }) {
        this.carReadRepository = carReadRepository;
        this.authorizer = authorizer;
    }

    async execute(query: RetrieveCarsPlanningQuery): Promise<CarsPlanningDTO> {
        await this.authorizer.authorize({
            actorId: query.actor.id,
        });

        return await this.carReadRepository.getCarsPlanning({
            startDate: query.startDate,
            endDate: query.endDate,
            limit: query.limit,
            cursor: decodeCursor(query.cursor),
        });
    }
}