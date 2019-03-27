const MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';
const MONGO_PORT = process.env.MONGO_PORT || '27017';
const MONGO_DB = process.env.MONGO_DB || 'certificados';
const MONGO_USER = process.env.MONGO_USER || 'root';
const MONGO_PASS = process.env.MONGO_PASS || '';
const MONGO_REPLICA_SET = process.env.MONGO_REPLICA_SET || '';

const mongoose = require('mongoose');
const strConnectionMongo = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?ssl=true&replicaSet=${MONGO_REPLICA_SET}&authSource=admin&retryWrites=true`;

mongoose.connect(strConnectionMongo, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
