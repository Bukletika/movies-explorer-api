const mongoose = require('mongoose');

const { linkTest, msgIncorrectUrl } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(res) { return linkTest.test(res); },
      message: () => msgIncorrectUrl,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(res) { return linkTest.test(res); },
      message: () => msgIncorrectUrl,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(res) { return linkTest.test(res); },
      message: () => msgIncorrectUrl,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
