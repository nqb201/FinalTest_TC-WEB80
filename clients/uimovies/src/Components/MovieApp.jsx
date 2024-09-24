import { useState, useEffect } from 'react';
import axios from 'axios';
import MovieCard from './MovieCard';  // Component để hiển thị từng phim
import MovieDetails from './Popup';  // Component để hiển thị chi tiết phim
import './style.css';  // CSS cho giao diện
import { FaSearch } from 'react-icons/fa';

const MovieApp = () => {
  const [movies, setMovies] = useState([]);  // Lưu dữ liệu phim
  const [selectedMovie, setSelectedMovie] = useState(null);  // Phim được chọn để hiển thị chi tiết
  const [currentIndex, setCurrentIndex] = useState(0);  // Quản lý trang hiện tại
  const [searchQuery, setSearchQuery] = useState('');  // Từ khóa tìm kiếm
  const [isSearchVisible, setIsSearchVisible] = useState(false);  // Trạng thái ẩn hiện của thanh tìm kiếm
  const moviesPerPage = 4;  // Số lượng phim mỗi trang

  // Lấy danh sách phim từ API khi component load
  useEffect(() => {
    axios.get('http://localhost:5000/api/movies')  // Gọi API từ backend
      .then(response => {
        setMovies(response.data.data);  // Lưu dữ liệu phim vào state
      })
      .catch(error => {
        console.error('Lỗi khi lấy danh sách phim:', error);
      });
  }, []);  // Mảng phụ thuộc rỗng => chỉ gọi 1 lần khi component load

  // Tìm kiếm phim
  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      axios.get(`http://localhost:5000/api/movies/search?name=${searchQuery}`)  // Gọi API tìm kiếm phim theo tên
        .then(response => {
          setMovies(response.data.data);  // Cập nhật danh sách phim sau khi tìm kiếm
        })
        .catch(error => {
          console.error('Lỗi khi tìm kiếm phim:', error);
        });
    } else {
      // Nếu không có từ khóa tìm kiếm, lấy lại tất cả phim
      axios.get('http://localhost:5000/api/movies')  // Gọi API để lấy tất cả phim
        .then(response => {
          setMovies(response.data.data);  // Cập nhật danh sách phim
        })
        .catch(error => {
          console.error('Lỗi khi lấy danh sách phim:', error);
        });
    }
  };

  // Tính toán số trang
  const totalMovies = movies.length;
  const maxIndex = Math.ceil(totalMovies / moviesPerPage) - 1;

  // Phim hiện tại được hiển thị
  const moviesToShow = movies.slice(currentIndex * moviesPerPage, (currentIndex + 1) * moviesPerPage);

  // Chuyển sang trang tiếp theo
  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Quay lại trang trước
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Xử lý khi chọn phim để hiển thị chi tiết
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  // Đóng pop-up chi tiết phim
  const handleCloseDetail = () => {
    setSelectedMovie(null);
  };

  // Xử lý khi nhấn vào icon tìm kiếm
  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible); // Đổi trạng thái hiện/ẩn
  };

  return (
    <div className="movie-app">
      <div className="header">
        <h2>Most Popular Movies</h2>
        <FaSearch className="search-icon" onClick={toggleSearchBar} />
      </div>

      {/* Hiển thị thanh tìm kiếm khi icon được nhấn */}
      {isSearchVisible && (
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      )}

      <div className="movie-list">
        {moviesToShow.map((movie) => (
          <MovieCard key={movie._id} movie={movie} onClick={handleMovieSelect} />
        ))}
      </div>

      {/* Nút điều hướng Previous/Next */}
      <div className="navigation-buttons">
        {currentIndex > 0 && (
          <button onClick={handlePrevious} className="arrow-button">←</button>
        )}
        {currentIndex < maxIndex && (
          <button onClick={handleNext} className="arrow-button">→</button>
        )}
      </div>

      {/* Hiển thị pop-up chi tiết phim */}
      {selectedMovie && (
      <MovieDetails movie={selectedMovie} onClose={handleCloseDetail} />
      )}

    </div>
  );
};

export default MovieApp;
