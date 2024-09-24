const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Hàm tạo JWT token
const signToken = (id) => {
  return jwt.sign({ id }, 'A7k%tL^G!YtPZpW09$#5', { expiresIn: '1d' });
};

// Đăng ký (Signup)
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tạo người dùng mới
    const newUser = await User.create({ username, password });

    // Tạo JWT token
    const token = signToken(newUser._id);

    // Gửi phản hồi thành công kèm token
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Đăng nhập (Login)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Kiểm tra xem username và password đã được cung cấp chưa
    if (!username || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide username and password',
      });
    }

    // Tìm người dùng dựa trên username
    const user = await User.findOne({ username });

    // Kiểm tra xem người dùng có tồn tại và mật khẩu có chính xác không
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect username or password',
      });
    }

    // Nếu đúng, tạo JWT token và trả về
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Middleware kiểm tra xác thực người dùng (Bảo vệ các route cần đăng nhập)
exports.protect = async (req, res, next) => {
  try {
    // Lấy token từ headers
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; // Lấy token từ "Bearer token"
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.',
      });
    }

    // Xác minh token
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Thay 'your_jwt_secret' bằng chuỗi bí mật thực tế

    // Kiểm tra xem người dùng có tồn tại không
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.',
      });
    }

    // Cho phép truy cập đến các route tiếp theo
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid token or not authorized',
    });
  }
};
