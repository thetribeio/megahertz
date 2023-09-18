import RentACar from '../../../src/core/useCases/carRental/rentACar/handler';

describe.each([
    {
        customer: {},
        availableCar: {},
        carRental: {}
    }
])('$customer.name rents a $carRental.car.model', function (testCase) {
    it('Scenario: A simple car rental\n' +
        'Given I am logged in as customer $customer.name\n' +
        'And there is 1 $availableCar.model in the system\n' +
        'And the $availableCar.model is available for the next $availableCar.availability\n' +
        'When I rent a $carRental.car.model for $rental.duration days starting $carRental.startDate.\n' +
        'Then it should create a new car rental in the system', () => {

    })
});