import http from 'http';
import express from 'express';

import { applyRoutes } from './src/utils';
import routes from './src/services/authRoutes';

import { initDependencies } from './src/config/index'

const app = express();
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

const server = http.createServer(app);
const {PORT} = process.env;

applyRoutes(routes,app);

async function start() {
    await initDependencies()
    server.listen(PORT, () =>
        console.log(`Server is running @ http://localhost:${PORT}...`),
    );
}
console.log('BAH')

start();