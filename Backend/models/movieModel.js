const mongoose = require('mongoose');

// Định nghĩa schema cho Movie
const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Movie name is required'],
  },
  time: {
    type: Number,
    required: [true, 'Movie duration is required'],
  },
  year: {
    type: Number,
    required: [true, 'Release year is required'],
  },
  image: {
    type: String,
    required: [true, 'Movie image is required'],
  },
  introduce: {
    type: String,
    required: [true, 'Movie description is required'],
  },
  image: { type: String }
});

// Tạo model từ schema
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
