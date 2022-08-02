require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization !== undefined ? req.headers.authorization.split(' ')[1] : null;

    if (!token) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }

    const userInfo = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'JWT_SECRET');

    if (!userInfo) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }

    req.user = userInfo;

    return next();
  } catch (e) {
    return next(e);
  }
};

module.exports = userAuth;
