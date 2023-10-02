import {container} from 'tsyringe';
import DateParser from '../../utils/dateParser';

/**
 * Provides tsyringe with testing utilities, such as date parsers.
 * This container as well as the features it provides are meant to be used in development only.
 */
const useTestingUtilities = (): void => {
    container.register("DateParser", {useClass: DateParser});
    const dateParser = container.resolve("DateParser");
    container.registerInstance("DateParser", dateParser);
}

export default useTestingUtilities;