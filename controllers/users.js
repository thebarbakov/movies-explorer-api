require('dotenv').config();

const NotFound = require('../errors/NotFound');
const CastError = require('../errors/CastError');

const User = require('../models/User');

const updateProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        name,
        about,
      },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new NotFound('Пользователь не найден'));
    }

    return res.status(200).json(req.body);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new CastError('Неверный формат данных'));
    }

    return next(e);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    return res.status(200).json(user);
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  updateProfile,
  getUserInfo,
};
