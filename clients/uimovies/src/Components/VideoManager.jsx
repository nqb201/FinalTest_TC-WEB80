import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './style.css';

const VideoManager = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ name: '', year: '', time: '', introduce: '' });
  const [editMovie, setEditMovie] = useState(null);  // Dùng để lưu thông tin phim đang được chỉnh sửa
  const [imageFile, setImageFile] = useState(null); // Lưu file hình ảnh
  const [sortOrder, setSortOrder] = useState('desc'); // Trạng thái sắp xếp (mặc định giảm dần)

  // Hàm gọi API để lấy danh sách phim
  const fetchMovies = useCallback(() => {
    axios.get(`http://localhost:5000/api/movies?sort=${sortOrder}`)
      .then(response => {
        setMovies(response.data.data);  // Cập nhật danh sách video sau khi API trả về
      })
      .catch(error => console.error(error));
  }, [sortOrder]); // Phụ thuộc vào sortOrder

  // Gọi API khi sortOrder thay đổi
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Hàm xử lý thêm phim mới
  const handleAddMovie = () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', newMovie.name);
    formData.append('year', newMovie.year);
    formData.append('time', newMovie.time);
    formData.append('introduce', newMovie.introduce);
    formData.append('image', imageFile);

    axios.post('http://localhost:5000/api/movies/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      console.log('Video added:', response.data); // Kiểm tra phản hồi
      fetchMovies(); // Cập nhật danh sách phim sau khi thêm mới
      setNewMovie({ name: '', year: '', time: '', introduce: '' });
      setImageFile(null); 
    })
    .catch(error => console.error('Error adding movie:', error));
  };

  // Hàm chỉnh sửa phim
  const handleEditMovie = () => {
    if (!editMovie) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', editMovie.name);
    formData.append('year', editMovie.year);
    formData.append('time', editMovie.time);
    formData.append('introduce', editMovie.introduce);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    axios.put(`http://localhost:5000/api/movies/${editMovie._id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      console.log('Video updated:', response.data); // Kiểm tra phản hồi
      fetchMovies(); // Cập nhật danh sách phim sau khi chỉnh sửa
      setEditMovie(null);
      setImageFile(null);
    })
    .catch(error => console.error('Error editing movie:', error));
  };

  // Hàm xóa phim
  const handleDeleteMovie = (id) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5000/api/movies/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log('Video deleted:', response.data); // Kiểm tra phản hồi
      fetchMovies(); // Cập nhật danh sách phim sau khi xóa
    })
    .catch(error => console.error('Error deleting movie:', error));
  };

  // Hàm xử lý file hình ảnh
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <div className="video-manager">
      <h2>Quản Lý Video</h2>

      {/* Nút sắp xếp */}
      <div className="sort-buttons">
        <button onClick={() => { setSortOrder('asc'); }}>Sắp xếp tăng dần</button>
        <button onClick={() => { setSortOrder('desc'); }}>Sắp xếp giảm dần</button>
      </div>

      {/* Thêm Video */}
      <div className="video-manager__add">
        <h3>Thêm Video Mới</h3>
        <input
          type="text"
          className="video-manager__input"
          placeholder="Tên phim"
          value={newMovie.name}
          onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
        />
        <input
          type="text"
          className="video-manager__input"
          placeholder="Năm sản xuất"
          value={newMovie.year}
          onChange={(e) => setNewMovie({ ...newMovie, year: e.target.value })}
        />
        <input
          type="text"
          className="video-manager__input"
          placeholder="Thời gian phim (phút)"
          value={newMovie.time}
          onChange={(e) => setNewMovie({ ...newMovie, time: e.target.value })}
        />
        <textarea
          className="video-manager__input"
          placeholder="Tóm tắt giới thiệu"
          value={newMovie.introduce}
          onChange={(e) => setNewMovie({ ...newMovie, introduce: e.target.value })}
        />
        <input type="file" onChange={handleFileChange} />
        <button className="video-manager__btn" onClick={handleAddMovie}>Thêm Video</button>
      </div>

      {/* Danh sách video */}
      <ul className="video-manager__list">
        {movies.map(movie => (
          <li key={movie._id} className="video-manager__item">
            <img src={movie.image} alt={movie.name} className="video-manager__image" />
            <span>{movie.name} ({movie.year})</span>
            <div className="video-manager__buttons">
              <button className="video-manager__btn" onClick={() => setEditMovie(movie)}>Chỉnh sửa</button>
              {editMovie && editMovie._id === movie._id && (
                <div className="video-manager__edit">
                  <input
                    type="text"
                    className="video-manager__input"
                    value={editMovie.name}
                    onChange={(e) => setEditMovie({ ...editMovie, name: e.target.value })}
                  />
                  <input
                    type="text"
                    className="video-manager__input"
                    value={editMovie.year}
                    onChange={(e) => setEditMovie({ ...editMovie, year: e.target.value })}
                  />
                  <input
                    type="text"
                    className="video-manager__input"
                    value={editMovie.time}
                    onChange={(e) => setEditMovie({ ...editMovie, time: e.target.value })}
                  />
                  <textarea
                    className="video-manager__input"
                    value={editMovie.introduce}
                    onChange={(e) => setEditMovie({ ...editMovie, introduce: e.target.value })}
                  />
                  <input type="file" onChange={handleFileChange} />
                  <button className="video-manager__btn" onClick={handleEditMovie}>Lưu thay đổi</button>
                </div>
              )}
              <button className="video-manager__btn delete-btn" onClick={() => handleDeleteMovie(movie._id)}>Xóa</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoManager;
