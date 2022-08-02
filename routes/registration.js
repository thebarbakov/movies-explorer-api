const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  signIn,
  signUp,
} = require('../controllers/registration');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  signIn,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  signUp,
);

module.exports = router;
