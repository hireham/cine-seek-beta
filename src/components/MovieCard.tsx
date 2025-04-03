import React from 'react';
import './MovieCard.css';

interface MovieCardProps {
  id: number;
  title: string;
  year: number;
  genres: string[];
  posterUrl?: string;
  onMovieClick: (movieId: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  year,
  genres,
  posterUrl,
  onMovieClick,
}) => {
  const handleClick = () => {
    onMovieClick(id);
  };

  return (
    <div 
      className="movie-card-item" 
      onClick={handleClick}
    >
      {posterUrl ? (
        <img src={posterUrl} alt={title} className="movie-card-poster" />
      ) : (
        <div className="movie-card-placeholder">{title}</div>
      )}
      <div className="movie-card-info">
        <h3>{title}</h3>
        <p>{year}</p>
        <div className="movie-card-genres">
          {genres.map((genre, index) => (
            <span key={index} className="movie-card-genre">{genre}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
