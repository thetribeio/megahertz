import express from 'express';
import carRentalsQueryRouter from '../../../../driving/REST/express/routes/query/carRentals';

const createApp = (): express.Express => {
    const app = express();
    app.use(express.json());

    app.use('/api/car-rentals/', carRentalsQueryRouter);

    return app;
}


export default createApp;