import React from 'react';
import './MovieCard.css';

interface MovieCardProps {
  title: string;
  subtitle?: string;
  year: number;
  genres: string[];
  posterUrl?: string;
  backgroundImage?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  subtitle,
  year,
  genres,
  posterUrl,
  backgroundImage,
}) => {
  return (
    <div className="movie-card" style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined }}>
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
