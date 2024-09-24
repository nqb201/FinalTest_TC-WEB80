const Movie = require('../models/movieModel');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Cấu hình multer để upload hình ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Đặt tên file với thời gian để tránh trùng lặp
  }
});

const upload = multer({ storage }); // Khởi tạo multer với cấu hình storage

// Middleware upload hình ảnh
exports.uploadImage = upload.single('image');

// Thêm phim mới với hình ảnh
exports.addMovieWithImage = async (req, res) => {
  try {
    // Kiểm tra nếu file hình ảnh không được upload
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No image file uploaded' });
    }

    // Tạo phim mới với đường dẫn hình ảnh
    const newMovie = new Movie({
      ...req.body,
      image: `/uploads/${req.file.filename}`  // Đường dẫn hình ảnh được lưu trong database
    });

    await newMovie.save();  // Lưu phim mới vào cơ sở dữ liệu

    res.status(201).json({
      status: 'success',
      data: newMovie,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Lấy danh sách phim với tùy chọn sắp xếp
exports.getMovies = async (req, res) => {
  try {
    // Kiểm tra nếu có query về sắp xếp tăng dần hoặc giảm dần
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;  // Mặc định là giảm dần
    const movies = await Movie.find().sort({ year: sortDirection });  // Sắp xếp theo năm sản xuất
    res.status(200).json({ status: 'success', data: movies });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Tìm kiếm phim theo tên
exports.searchMovieByName = async (req, res) => {
  try {
    const { name } = req.query;
    const movies = await Movie.find({ name: { $regex: name, $options: 'i' } });  // Tìm kiếm không phân biệt hoa thường
    res.status(200).json({ status: 'success', data: movies });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Thêm phim mới không có hình ảnh
exports.addMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).json({ status: 'success', data: newMovie });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Sửa thông tin phim
exports.updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ status: 'success', data: updatedMovie });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

// Xóa phim
exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
