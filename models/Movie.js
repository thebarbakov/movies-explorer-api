const { Schema, model, Types } = require('mongoose');
const isUrl = require('validator/lib/isURL');

const movieSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator: (link) => isUrl(link),
        message: 'Некорректный формат ссылки',
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (link) => isUrl(link),
        message: 'Некорректный формат ссылки',
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (link) => isUrl(link),
        message: 'Некорректный формат ссылки',
      },
    },
    owner: {
      type: Types.ObjectId,
      ref: 'user',
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
);

module.exports = model('Movie', movieSchema);
