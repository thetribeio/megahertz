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
        return {
            id: carRentalDTO.id,
            customer: {
                id: carRentalDTO.customerId
            },
            car: {
                id: carRentalDTO.car.id,
                model: {
                    id: carRentalDTO.car.model.id
                }
            },
            totalPrice: carRentalDTO.totalPrice,
            pickupDateTime: carRentalDTO.pickupDateTime.toISOString(),
            dropOffDateTime: carRentalDTO.dropOffDateTime.toISOString(),
        }
    }
}