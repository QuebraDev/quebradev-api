const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const database = require('../config/database');
const cors = require('cors');

//Rotas
const index = require('./routes/index');
const certified = require('./routes/certifiedRoute');

app.use(cors({
    origin: ['http://localhost:4000', 'https://quebra.dev']
}))

app.use(bodyParser());

app.use('/', index);
app.use('/certified', certified);

module.exports = app;