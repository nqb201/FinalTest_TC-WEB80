const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/moviedb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Import routes
const movieRoutes = require('./routers/moviesRouters');
const authRoutes = require('./routers/authRoutes');

// Cho phép truy cập công khai thư mục uploads
app.use('/uploads', express.static('uploads'));


// Sử dụng routes
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
