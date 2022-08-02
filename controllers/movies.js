const Movie = require('../models/Movie');
const NotFound = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');
const CastError = require('../errors/CastError');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });

    res.status(200).json(movies);
  } catch (e) {
    next(e);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;

    const movie = new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner: req.user._id,
    });

    const newMovie = await movie.save();

    return res.status(201).json(newMovie);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new CastError('Неверный формат данных'));
    }
    return next(e);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.id });

    if (!movie) {
      return next(new NotFound('Запрашиваемый фильм для удаления не найдена'));
    }

    if (movie.owner._id.toString() !== req.user._id.toString()) {
      return next(new ForbiddenError('Фильм недоступен для удаления'));
    }

    await Movie.findOneAndDelete({ _id: req.params.id });

    return res.status(200).json({ message: 'Ok!' });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
