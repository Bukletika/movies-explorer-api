const rateLimit = require('express-rate-limit');

const { msgManyQuery } = require('../utils/constants');

// Ограничиваем количество запросов с одного IP-адреса в единицу времени
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: msgManyQuery,
});

module.exports = limiter;
