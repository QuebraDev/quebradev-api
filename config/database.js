const MONGO_HOST = process.env.MONGO_HOST
const MONGO_PORT = process.env.MONGO_PORT
const MONGO_DB = process.env.MONGO_DB
const MONGO_USER = process.env.MONGO_USER
const MONGO_PASS = process.env.MONGO_PASS

const mongoose = require('mongoose');
const strConnectionMongo = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.connect(strConnectionMongo, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
