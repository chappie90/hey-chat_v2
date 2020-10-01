import dotenv from 'dotenv';
dotenv.config();
require('./models/User');
require('./models/Chat');
require('./models/Message');
import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
const socket = require('socket.io');

const app: Application = express();
const server = http.createServer(app);

app.use(bodyParser.json());

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
});
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to database: ' + err);
});

// API routes
require('./routes/routes')(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello !');
});

// Socket connection
const io = socket.listen(server);
require('./socket/socket')(io);

const port = process.env.SERVER_PORT || 3006;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});