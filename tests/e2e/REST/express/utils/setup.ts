import express from 'express';
import http from 'http';
import 'dotenv/config';

export const startServer = (app: express.Express): http.Server => {
    const port = Number(process.env.EXPRESS_SERVER_PORT);
    return app.listen(port, () => {})
};