require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const app = express();

app.use(morgan('dev'));
app.use(cors());


app.use(express.urlencoded({ extended: false }));
app.disable('x-powered-by');



module.exports = app;
