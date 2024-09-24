import { moviePropTypes, onClickPropTypes } from './propTypes';
import './style.css'

const MovieCard = ({ movie, onClick }) => {
  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      <img src={movie.image} alt={movie.name} />
      <h3>{movie.name}</h3>
      <p>{movie.time} min | {movie.year}</p>
    </div>
  );
};


// Sử dụng PropTypes từ file propTypes.js
MovieCard.propTypes = {
  movie: moviePropTypes,
  onClick: onClickPropTypes
};

export default MovieCard;
