const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

// Подключим классы ошибок
const Error400 = require('../errors/Error400');
const Error404 = require('../errors/Error404');
const Error409 = require('../errors/Error409');
const Error401 = require('../errors/Error401');

const {
  msgIncorrectAuthorization,
  msgUserExists,
  msgNotUserById,
  msgFalseProfileData,
} = require('../utils/constants');

// eslint-disable-next-line consistent-return
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new Error401(msgIncorrectAuthorization));
      }

      bcrypt.compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
            return next(new Error401(msgIncorrectAuthorization));
          }

          jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' }, (err, token) => {
            if (err) {
              next(err);
            }

            return res.send({ token });
          });
        })
        .catch(next);
    })
    .catch(next);
};

// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        return next(new Error409(msgUserExists));
      }

      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({
            email, password: hash, name,
          })
            .then(({
              // eslint-disable-next-line no-shadow
              _id, name, email,
            }) => {
              res.send({
                _id, email, name,
              });
            })
            .catch(next);
        })
        .catch(next);
    })

    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(new Error404(msgNotUserById))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.codeName === 'DuplicateKey') {
        next(new Error409(msgFalseProfileData));
      } else if (err.name === 'ValidationError') {
        next(new Error400(msgFalseProfileData));
      } else {
        next(err);
      }
    });
};
