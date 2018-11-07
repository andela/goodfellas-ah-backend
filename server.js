import http from 'http';
import express from 'express';
import socketio from 'socket.io';
import { urlencoded, json } from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';
import cors from 'cors';
import { serve, setup } from 'swagger-ui-express';
import router from './routes';
import eventDispatch from './lib/eventDispatch';
import { tokenIsValid } from './middleware/authentication';


import swaggerDocument from './swagger.json';

const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);

app.use('/api-docs', serve, setup(swaggerDocument));

app.use(morgan('dev'));
app.use(cors());

app.use(session({ secret: process.env.SESSION_SECRET }));

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(router);

const io = socketio.listen(server);
io.use((socket, next) => {
  const { token } = socket.handshake.query;
  const userId = tokenIsValid(token).id;
  if (userId) {
    socket.userId = userId;
    return next();
  }
  return next(new Error('authentication error'));
});
eventDispatch(io);

server.listen(port, () => {
  console.log(`Now listening on port ${port}`);
});

module.exports = { app };
