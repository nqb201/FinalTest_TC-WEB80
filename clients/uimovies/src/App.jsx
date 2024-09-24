import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import MovieApp from './Components/MovieApp';
import Login from './Components/Login';  // Import trang Login
import VideoManager from './Components/VideoManager'; // Import trang quản lý video

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<MovieApp />} />  {/* Trang chủ */}
          <Route path="/login" element={<Login />} />  {/* Trang đăng nhập */}
          <Route path="/video-manager" element={<VideoManager />} />  {/* Trang quản lý video */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
