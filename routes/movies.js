const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const { linkSchedule } = require('../utils/isLink');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(linkSchedule),
      trailerLink: Joi.string().required().pattern(linkSchedule),
      thumbnail: Joi.string().required().pattern(linkSchedule),
      movieId: Joi.string().length(24).hex().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
