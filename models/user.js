const validator = require('validator');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs'); // импортируем bcrypt

// Подключим классы ошибок
const Error401 = require('../errors/Error401');

const {
  msgIncorrectAuthorization,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      isAsync: false,
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // удаление поля из запроса по умолчанию
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')

    .then((user) => {
      if (!user) {
        throw new Error401(msgIncorrectAuthorization);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Error401(msgIncorrectAuthorization);
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
