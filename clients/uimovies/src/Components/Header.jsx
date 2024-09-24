import './style.css'; 
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import Link và useNavigate từ react-router-dom

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);  // State để quản lý trạng thái ẩn/hiện của dropdown
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State để kiểm tra trạng thái đăng nhập
  const dropdownRef = useRef(null);  // Tạo tham chiếu cho dropdown menu
  const navigate = useNavigate();

  // Hàm để chuyển đổi dropdown
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);  // Đổi trạng thái của dropdown khi click
  };

  // Hàm để ẩn dropdown khi click ra ngoài
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);  // Đóng dropdown nếu click ra ngoài vùng dropdown
    }
  };

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');  // Lấy token từ localStorage
    if (token) {
      setIsLoggedIn(true);  // Cập nhật trạng thái đăng nhập nếu có token
    }
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');  // Xóa token khỏi localStorage
    setIsLoggedIn(false);  // Cập nhật trạng thái đăng xuất
    navigate('/');  // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  // Sử dụng useEffect để thêm và xóa event listener khi component mount và unmount
  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);  // Lắng nghe sự kiện click chuột bên ngoài
    } else {
      document.removeEventListener('mousedown', handleClickOutside);  // Xóa lắng nghe khi dropdown đóng
    }

    // Cleanup event listener khi component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <div className="header">
      <div className="header-left">
        <button className="menu-button" onClick={toggleDropdown}>☰</button>
        {dropdownVisible && (  // Hiển thị dropdown khi dropdownVisible = true
          <div className="dropdown-menu" ref={dropdownRef}>
            {isLoggedIn ? (
              <>
                <Link to="/video-manager" className="dropdown-item">Account</Link>
                <span className="dropdown-item" onClick={handleLogout}>Logout</span>
              </>
            ) : (
              <Link to="/login" className="dropdown-item">Login</Link>
            )}
            <Link to="/movies" className="dropdown-item">Movies</Link>
            <Link to="/watch" className="dropdown-item">Watch</Link>
            <Link to="/celebs" className="dropdown-item">Celebs</Link>
          </div>
        )}
      </div>
      <div className="header-center">
        <h1 className="logo">
          <Link to="/"> {/* Sử dụng Link để điều hướng về trang chủ */}
            MOVIE <span className="ui-badge">UI</span>
          </Link>
        </h1>
      </div>
      <div className="header-right">
        {/* Các chức năng khác có thể được thêm vào đây */}
      </div>
    </div>
  );
};

export default Header;
