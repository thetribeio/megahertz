import {container} from 'tsyringe';
import {Request, Response, Router} from 'express';
import RetrieveACarRental from 'src/core/useCases/carRental/query/retrieveACarRental/handler';
import CarRentalView from 'src/driving/views/carRental/base';
import CarRentalPresenter from 'src/driving/presenters/carRental/base';

const router = Router();

/**
 * REST entry point to retrieve a car rental.
 */
router.get('/:id', [], async (req: Request, res: Response) => {
    // EXERCISE #5: MISSING CODE HERE
    const presentedCarRental: CarRentalView = new CarRentalPresenter().present({carRentalDTO});

    return res.status(200).send(presentedCarRental);
})

export default router;