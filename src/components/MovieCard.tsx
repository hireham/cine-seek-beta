import React from 'react';
import './MovieCard.css';

interface MovieCardProps {
  id: number;
  title: string;
  subtitle?: string;
  year: number;
  genres: string[];
  posterUrl?: string;
  backgroundImage?: string;
  onMovieClick: (movieId: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  subtitle,
  year,
  genres,
  posterUrl,
  backgroundImage,
  onMovieClick,
}) => {
  const handleClick = () => {
    onMovieClick(id);
  };

  return (
    <div 
      className="movie-card" 
      onClick={handleClick}
      style={{ 
      backgroundImage: backgroundImage 
        ? `url(${backgroundImage})` 
        : posterUrl 
          ? `url(${posterUrl})` 
          : undefined 
    }}>
      <div className="movie-card-content">
        {title && <h2 className="movie-title">{title}</h2>}
        {subtitle && <h3 className="movie-subtitle">{subtitle}</h3>}
        {year && <p className="movie-year">{year}</p>}
        {genres && genres.length > 0 && (
          <div className="movie-genres">
            {genres.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
