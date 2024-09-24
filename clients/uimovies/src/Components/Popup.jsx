import { moviePropTypes, onClosePropTypes } from './propTypes'; 
import './style.css';

const MovieDetails = ({ movie, onClose }) => {
  return (
    <div className="overlay">
      <div className="popup">
        <button onClick={onClose} className="close-btn">×</button>
        <div className="popup-content">
          <img src={movie.image} alt={movie.name} className="popup-image" />
          <div className="popup-info">
            <h2>{movie.name}</h2>
            <p>{movie.time} min | {movie.year}</p>
            <p>{movie.introduce}</p>
            <a href="#" className="play-button">PLAY MOVIE</a>
          </div>
        </div>
      </div>
    </div>
  );
};

MovieDetails.propTypes = {
  movie: moviePropTypes,
  onClose: onClosePropTypes
};

export default MovieDetails;
