const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
  },
});

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
  // Chỉ mã hóa mật khẩu nếu nó được sửa đổi hoặc mới
  if (!this.isModified('password')) return next();

  // Mã hóa mật khẩu với bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Phương thức kiểm tra mật khẩu khi đăng nhập
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Tạo model từ schema
const User = mongoose.model('User', userSchema);

module.exports = User;
