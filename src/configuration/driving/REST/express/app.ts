import express from 'express';
import carRentalsQueryRouter from '../../../../driving/REST/express/routes/query/carRentals';

/**
 * Creates and returns an instance of express.
 */
const createApp = (): express.Express => {
    const app = express();
    app.use(express.json());

    // The routing below requires further work to integrate command routes as well.
    app.use('/api/car-rentals/', carRentalsQueryRouter);

    return app;
}


export default createApp;