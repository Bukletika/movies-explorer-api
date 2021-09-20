const Movie = require('../models/movie');

// Подключим классы ошибок
const Error400 = require('../errors/Error400');
const Error403 = require('../errors/Error403');
const Error404 = require('../errors/Error404');

const {
  msgCardsNotFound,
  msgIncorrectData,
  msgCardNotExist,
  msgCantDel,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(() => {
      next(new Error404(msgCardsNotFound));
    });
};

module.exports.postMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const validationError = new Error400(msgIncorrectData);
        next(validationError);
      } else {
        next(err);
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
          .then(() => res.send({ movie }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        next(err);
      } else if (err.statusCode === 403) {
        next(err);
      } else {
        next(err);
      }
    });
};
