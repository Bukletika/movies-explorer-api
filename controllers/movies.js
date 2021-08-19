const Movie = require('../models/movie');

// Подключим классы ошибок
const Error400 = require('../errors/Error400');
const Error500 = require('../errors/Error500');
const Error403 = require('../errors/Error403');
const Error404 = require('../errors/Error404');

const {
  msgCardsNotFound,
  msgIncorrectData,
  msgCardNotExist,
  msgCantDel,
  msgServerError,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => res.status(200).send(movies))
    .catch(() => {
      next(new Error404(msgCardsNotFound));
    });
};

module.exports.postMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new Error400(msgIncorrectData);
        next(validationError);
      } else {
        const baseError = new Error500('');
        next(baseError);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(new Error404(msgCardNotExist))
    .then((movie) => {
      if (JSON.stringify(movie.owner) !== JSON.stringify(owner)) {
        throw new Error403(msgCantDel);
      } else {
        Movie.deleteOne({ _id: movieId })
          .then(() => res.status(200).send({ movie }))
          .catch(() => { next(new Error500(msgServerError)); });
      }
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      } else if (err.statusCode === 403) {
        next(err);
      } else {
        const baseError = new Error500('');
        next(baseError);
      }
    });
};
