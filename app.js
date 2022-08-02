const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const errorHandler = require('./errors/ServerError');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3002 } = process.env;

let mongoURI;

if (process.env.NODE_ENV === 'production') {
  mongoURI = process.env.MONGO_DB_PROD;
} else if (process.env.NODE_ENV === 'development') {
  // mongoURI = process.env.MONGO_DB_DEV;
  //
  // URI для подключения для production и edvelopment лежит в файле .env,
  // но там есть логин и пароль для подключения
  // к базе данных, которые в публичный доступ выкладывать не совсем здорово
  //
  mongoURI = 'mongodb://localhost:27017/moviesdb';
}

const app = express();

mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedCors = [
  'http://movies.thebarbakov.ru',
  'https://movies.thebarbakov.ru',
];

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (allowedCors.some((e) => e.test && e.test(origin)) || allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
});

app.use(requestLogger);

app.use(require('./utils/rateLimits'));

app.use(helmet());

app.use('/api', require('./routes/index'));

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT} port`);
});
