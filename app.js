const express = require('express');

require('dotenv').config();

const cors = require('cors');

const app = express();

const mongoose = require('mongoose');

const helmet = require('helmet');

const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { urlMongoDB } = require('./utils/constants');

const router = require('./routes');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

app.use(cors());

app.use(helmet());

// Подключаемся к серверу mongo
mongoose.connect(urlMongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDb has starded...')) /* eslint-disable-line no-console */
  .catch((e) => console.log(e)); /* eslint-disable-line no-console */

app.use('/', express.json());

app.use(requestLogger); // Подключаем логгер запросов

app.use(limiter); // Подключаем limiter

app.use('/', router);

// Обработчики ошибок
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use('*', require('./middlewares/errorHandler'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); /* eslint-disable-line no-console */
});
