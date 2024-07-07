import http from 'http';
import express from 'express';

import { applyRoutes } from './src/utils';
import { applyMiddleware } from './src/utils';
import routes from './src/services/authRoutes';

import { initDependencies } from './src/config/index';

import middlewareMethods from './src/middleware';

const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());


applyMiddleware(middlewareMethods, app);
applyRoutes(routes,app);

const server = http.createServer(app);
const {PORT} = process.env;


async function start() {
    await initDependencies()
    server.listen(PORT, () =>
        console.log(`Server is running @ http://localhost:${PORT}...`),
    );
}

start();