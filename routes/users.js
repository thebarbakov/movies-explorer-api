const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const {
  updateProfile,
  getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateProfile,
);

module.exports = router;
