import express from 'express';
import http from 'http';

export const startServer = (app: express.Express): http.Server => app.listen(3030, () => {
    console.info(`Server listening on port ${3030}`);
});