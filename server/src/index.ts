import dotenv from 'dotenv';
dotenv.config();
require('./models/User');
require('./models/Chat');
require('./models/Message');
import express, { Application, Request, Response } from 'express';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';
import serveIndex from 'serve-index';
import mongoose from 'mongoose';
import socket from 'socket.io';
import apn from 'apn';
import firebaseAdmin from "firebase-admin";

const app: Application = express();
const server = http.createServer(app);

app.use(bodyParser.json());
app.use('/public/', express.static('src/public'), serveIndex('src/public', {'icons': true}));

(global as any).appRoot = path.resolve(__dirname);

// MongoDB connection
const mongoUri = `mongodb+srv://stoyangarov:${
                  process.env.DB_PASSWORD}@emaily-w8ewa.mongodb.net/${
                  process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
mongoose.connection.on('connected', () => {
  console.log('Connected to database');

  // Socket connection
  const io = socket.listen(server);
  require('./socket/socket').initSocket(io);
});
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to database: ' + err);
});

// Apple Push Notification provider API connection
// Sandbox or production APN service
const apnProduction = process.env.NODE_ENV === 'production' ? true : false;
const options = {
  token: {
    key: `${(global as any).appRoot}/private/certificates/${process.env.APPLE_KEY_FILE}`,
    keyId: process.env.APPLE_KEY_ID,
    teamId: process.env.APPLE_TEAM_ID
  },
  production: apnProduction
};
const apnProvider = new apn.Provider(options);
(global as any).apnProvider = apnProvider;

// Firebase Admin connection
const serviceAccount = require(`${(global as any).appRoot}/private/certificates/${process.env.FIREBASE_ACCOUNT_KEY}`);
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});
(global as any).firebaseAdmin = firebaseAdmin;

// API routes
require('./routes')(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello !');
});

// Handle errors
app.use((err, req: Request, res: Response, next) => {
  // console.error(err);
  console.log('some error')
  // console.log(err.) 
  // res.status(422).send({ message: 'Something went wrong!' });
  next(err);
  // res.status(error.status || 500).send({
  //   error: {
  //     status: error.status || 500,
  //     message: error.message || 'Internal Server Error',
  //   },
  // });
});

const port = process.env.SERVER_PORT || 3006;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});