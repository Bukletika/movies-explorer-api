const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');

const { msgNotFound } = require('../utils/constants');

// Подключим контроллеры
const {
  login, createUser,
} = require('../controllers/users');

// Подключим роуты
const usersRouter = require('./users');
const moviesRouter = require('./movies');

// Подключим классы ошибок
const Error404 = require('../errors/Error404');

// Роуты, не требующие авторизации
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

// Роуты с авторизацией
router.use(auth, usersRouter);
router.use(auth, moviesRouter);

// Ошибка 404
router.use('*', (req, res, next) => {
  next(new Error404(msgNotFound));
});

module.exports = router;
