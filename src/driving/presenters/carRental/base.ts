import CarRentalView from '../../views/carRental/base';
import CarRentalDTO from '../../../core/domain/carRental/dto';

export default class CarRentalPresenter {
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