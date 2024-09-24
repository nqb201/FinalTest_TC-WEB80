const express = require('express');
const movieController = require('../controllers/movieController');
const authController = require('../controllers/authController');

const router = express.Router();

// Route lấy danh sách phim
router.get('/', movieController.getMovies);

// Route tìm kiếm phim theo tên
router.get('/search', movieController.searchMovieByName);

// Route thêm phim mới không có hình ảnh
router.post('/', authController.protect, movieController.addMovie);

// Route thêm phim mới với hình ảnh (phải đăng nhập)
router.post('/upload', authController.protect, movieController.uploadImage, movieController.addMovieWithImage);

// Route sửa phim (phải đăng nhập)
router.put('/:id', authController.protect, movieController.updateMovie);

// Route xóa phim (phải đăng nhập)
router.delete('/:id', authController.protect, movieController.deleteMovie);

module.exports = router;
