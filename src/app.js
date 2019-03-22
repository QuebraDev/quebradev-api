const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const database = require('../config/database');

//Rotas
const index = require('./routes/index');
const certified = require('./routes/certifiedRoute');

app.use(bodyParser());

app.use('/', index);
app.use('/certified', certified);

module.exports = app;