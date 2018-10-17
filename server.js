import express from 'express';
import { urlencoded, json } from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import { serve, setup } from 'swagger-ui-express';
import router from './routes';
import eventDispatch from './lib/eventDispatch';


import swaggerDocument from './swagger.json';

const app = express();

app.use('/api-docs', serve, setup(swaggerDocument));

app.use(morgan('dev'));

app.use(session({ secret: process.env.SESSION_SECRET }));

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(router);
eventDispatch();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});

module.exports = { app };
