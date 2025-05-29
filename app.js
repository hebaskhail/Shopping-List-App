require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./src/middlewares/errorHandler');
const app = express();

app.use(morgan('dev'));
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.disable('x-powered-by');

app.use('/api', require('./src/routes'));

app.use(errorHandler);

module.exports = app;
