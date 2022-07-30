const router = require('express').Router();

const NotFound = require('../errors/NotFound');

router.use('/', require('./registration'));

router.use(require('../middlewares/auth'));

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.all('*', (req, res, next) => {
  next(new NotFound('Неправильный путь'));
});

module.exports = router;
