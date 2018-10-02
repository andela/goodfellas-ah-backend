const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./models');
const router = require('./routes');

const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);

module.exports = { app }
