import CarRental from "../../model";

export default interface CarRentalReadRepositoryInterface {
    read(carRentalId: string): Promise<CarRental>
}