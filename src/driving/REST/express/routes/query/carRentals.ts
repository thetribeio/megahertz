import {container} from 'tsyringe';
import {Request, Response, Router} from 'express';
import RetrieveACarRental from '../../../../../core/useCases/carRental/retrieveACarRental/handler';
import CarRentalView from "../../../../views/carRental/base";
import CarRentalPresenter from "../../../../presenters/carRental/base";

const router = Router();

/**
 * REST entry point to retrieve a car rental.
 */
router.get('/:id', [], async (req: Request, res: Response) => {
    const uc: RetrieveACarRental = new RetrieveACarRental({
        carRentalReadRepository: container.resolve("CarRentalReadRepositoryInterface"),
    });
    const carRentalDTO = await uc.execute({
        id: req.params.id,
    });
    const presentedCarRental: CarRentalView = new CarRentalPresenter().present({carRentalDTO});

    return res.status(200).send(presentedCarRental);
})

export default router;