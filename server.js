import express from 'express';
import { urlencoded, json } from 'body-parser';
import morgan from 'morgan';
import { serve, setup } from 'swagger-ui-express';
import router from './routes';


import swaggerDocument from './swagger.json';

const app = express();

app.use('/api-docs', serve, setup(swaggerDocument));

app.use(morgan('dev'));

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(router);

const port = process.env.PORT || 4000;

app.listen(port);

module.exports = { app };
