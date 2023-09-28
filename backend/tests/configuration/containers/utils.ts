import {container} from 'tsyringe';
import DateParser from "../../utils/dateParser";

const useTestingUtilities = (): void => {
    container.register("DateParser", {useClass: DateParser});
    const dateParser = container.resolve("DateParser");
    container.registerInstance("DateParser", dateParser);
}

export default useTestingUtilities;