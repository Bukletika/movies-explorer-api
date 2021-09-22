const validator = require('validator');
const mongoose = require('mongoose');

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

module.exports = mongoose.model('user', userSchema);
