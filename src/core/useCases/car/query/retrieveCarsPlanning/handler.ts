import CarsPlanningDTO from "src/core/domain/car/outputBoundaries/outputBoundary";
import CarReadRepositoryInterface from "src/core/domain/car/interfaces/repositories/read";

export default class RetrieveCarsPlanning {
    private readonly carReadRepository;

    constructor({carReadRepository}: { carReadRepository: CarReadRepositoryInterface }) {
        this.carReadRepository = carReadRepository;
    }

    async execute(): Promise<CarsPlanningDTO> {
        return await this.carReadRepository.getCarsPlanning();
    }
}