import CarRentalView from 'src/driving/views/carRental/base';
import CarRentalDTO from 'src/core/domain/carRental/dto';

/**
 * Base presenter for car rental views.
 */
export default class CarRentalPresenter {

    /**
     * Maps a car rental DTO to a car rental view.
     *
     * @param carRentalDTO The car rental DTO to use for mapping.
     */
    present({carRentalDTO}: { carRentalDTO: CarRentalDTO }): CarRentalView {
        // EXERCISE #5: MISSING CODE HERE
    }
}