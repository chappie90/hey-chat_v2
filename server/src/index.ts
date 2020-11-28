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
const socket = require('socket.io');

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