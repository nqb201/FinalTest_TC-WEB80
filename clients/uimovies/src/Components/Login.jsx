import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import './style.css'; // Import CSS tùy chỉnh

const LoginRegister = () => {
  // Trạng thái cho form đăng nhập
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập

  // Trạng thái cho form đăng ký
  const [registerCredentials, setRegisterCredentials] = useState({ username: '', password: '' });
  const [registerError, setRegisterError] = useState('');

  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  // Kiểm tra nếu người dùng đã đăng nhập khi tải trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
    }
  }, []);

  // Xử lý đăng nhập
  const handleLogin = () => {
    if (!loginCredentials.username || !loginCredentials.password) {
      setLoginError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    axios
      .post('http://localhost:5000/api/auth/login', loginCredentials) // Đường dẫn tới API đăng nhập của bạn
      .then((response) => {
        localStorage.setItem('token', response.data.token); // Lưu token nhận được từ API
        setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
        alert('Đăng nhập thành công!');
        navigate('/video-manager'); // Điều hướng đến trang VideoManager sau khi đăng nhập thành công
      })
      .catch(() => {
        setLoginError('Sai tài khoản hoặc mật khẩu.');
      });
  };

  // Xử lý đăng ký
  const handleRegister = () => {
    if (!registerCredentials.username || !registerCredentials.password) {
      setRegisterError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    axios
      .post('http://localhost:5000/api/auth/signup', registerCredentials) // Đường dẫn tới API đăng ký của bạn
      .then(() => {
        alert('Đăng ký thành công, vui lòng kiểm tra email để xác nhận!');
      })
      .catch(() => {
        setRegisterError('Đăng ký thất bại.');
      });
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
    window.location.href = '/login'; // Chuyển về trang đăng nhập
  };

  return (
    <div className="login-register-container">
      {isLoggedIn ? (
        <div className="logout-section">
          <h2>Chào mừng bạn đã đăng nhập!</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Đăng Xuất
          </button>
        </div>
      ) : (
        <>
          {/* Form Đăng Nhập */}
          <div className="login-section">
            <h2>Đăng Nhập</h2>
            {loginError && <p className="error-message">{loginError}</p>}
            <input
              type="text"
              placeholder="Tên khách hàng hoặc email"
              value={loginCredentials.username}
              onChange={(e) => setLoginCredentials({ ...loginCredentials, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={loginCredentials.password}
              onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
            />
            <div className="login-options">
              <label>
                <span>Ghi nhớ mật khẩu</span>
                <input type="checkbox" name="remember-password" aria-label="Ghi nhớ mật khẩu" />
              </label>
              <a href="/forgot-password" aria-label="Quên mật khẩu?">Quên mật khẩu?</a>
            </div>
            <button className="login-btn" onClick={handleLogin}>
              Đăng Nhập
            </button>
          </div>

          {/* Form Đăng Ký */}
          <div className="register-section">
            <h2>Đăng Ký</h2>
            {registerError && <p className="error-message">{registerError}</p>}
            <input
              type="text"
              placeholder="Tên tài khoản"
              value={registerCredentials.username}
              onChange={(e) => setRegisterCredentials({ ...registerCredentials, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={registerCredentials.password}
              onChange={(e) => setRegisterCredentials({ ...registerCredentials, password: e.target.value })}
            />
            <p className="register-info">
              Với tài khoản mới, bạn sẽ nhận được email xác nhận. Vui lòng kiểm tra và kích hoạt tài khoản.
            </p>
            <button className="register-btn" onClick={handleRegister}>
              Đăng Ký
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LoginRegister;
