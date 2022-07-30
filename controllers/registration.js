require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const User = require('../models/User');

const { NODE_ENV, JWT_SECRET } = process.env;

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }, '+password');

    if (!user) {
      return next(new UnauthorizedError('Неверный email'));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new UnauthorizedError('Пароль не верен'));
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'JWT_SECRET',
      { expiresIn: '7d' },
    );

    return res.status(200).send({ token });
  } catch (e) {
    return next(e);
  }
};

const signUp = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const user = new User({
      email,
      name,
      password: await bcrypt.hash(password, 10),
    });

    const newUser = await user.save();

    newUser.password = undefined;

    return res.status(201).json(newUser);
  } catch (e) {
    if (e.code === 11000) {
      return next(new ConflictError('Пользователь уже существует'));
    }
    return next(e);
  }
};

module.exports = {
  signUp,
  signIn,
};
