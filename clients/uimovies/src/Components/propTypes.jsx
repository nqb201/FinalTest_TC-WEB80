import PropTypes from 'prop-types';

// Định nghĩa kiểu PropTypes cho movie
export const moviePropTypes = PropTypes.shape({
  name: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  introduce: PropTypes.string
});

// Định nghĩa kiểu PropTypes cho hàm onClick và onClose
export const onClickPropTypes = PropTypes.func.isRequired;
export const onClosePropTypes = PropTypes.func.isRequired;
