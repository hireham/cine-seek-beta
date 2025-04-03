import React from 'react';
import { MovieDetails as MovieDetailsType } from '../services/tmdbService';
import './MovieDetails.css';

interface MovieDetailsProps {
  movieDetails: MovieDetailsType | null;
  onClose: () => void;
  isLoading: boolean;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ 
  movieDetails, 
  onClose,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="movie-details-overlay">
        <div className="movie-details-container">
          <div className="movie-details-header">
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="movie-details-overlay">
        <div className="movie-details-container">
          <div className="movie-details-header">
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="error-message">
            <p>Failed to load movie details. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="movie-details-overlay">
      <div 
        className="movie-details-container"
        style={{
          backgroundImage: movieDetails.backdropUrl 
            ? `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${movieDetails.backdropUrl})`
            : undefined
        }}
      >
        <div className="movie-details-header">
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="movie-details-content">
          <div className="movie-details-main">
            {movieDetails.posterUrl && (
              <div className="movie-poster">
                <img src={movieDetails.posterUrl} alt={`${movieDetails.title} poster`} />
              </div>
            )}
            
            <div className="movie-info">
              <h1>{movieDetails.title}</h1>
              
              <div className="movie-meta">
                <span className="release-date">{formatDate(movieDetails.releaseDate)}</span>
                {movieDetails.runtime && (
                  <span className="runtime">{formatRuntime(movieDetails.runtime)}</span>
                )}
                <span className="rating">{movieDetails.voteAverage.toFixed(1)}/10</span>
              </div>
              
              {movieDetails.genres.length > 0 && (
                <div className="genres">
                  {movieDetails.genres.map((genre, index) => (
                    <span key={index} className="genre-tag">{genre}</span>
                  ))}
                </div>
              )}
              
              <div className="overview">
                <h3>Overview</h3>
                <p>{movieDetails.overview}</p>
              </div>
              
              {movieDetails.crew.length > 0 && (
                <div className="crew">
                  <h3>Crew</h3>
                  <ul>
                    {movieDetails.crew.map((crewMember) => (
                      <li key={`${crewMember.id}-${crewMember.job}`}>
                        <span className="crew-job">{crewMember.job}:</span> {crewMember.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {movieDetails.cast.length > 0 && (
            <div className="cast-section">
              <h3>Cast</h3>
              <div className="cast-list">
                {movieDetails.cast.map((castMember) => (
                  <div key={`${castMember.id}-${castMember.character}`} className="cast-member">
                    {castMember.profileUrl && (
                      <div className="cast-photo">
                        <img src={castMember.profileUrl} alt={castMember.name} />
                      </div>
                    )}
                    <div className="cast-info">
                      <div className="cast-name">{castMember.name}</div>
                      <div className="cast-character">{castMember.character}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {movieDetails.reviews.length > 0 && (
            <div className="reviews-section">
              <h3>Reviews</h3>
              <div className="reviews-list">
                {movieDetails.reviews.map((review) => (
                  <div key={review.id} className="review">
                    <div className="review-header">
                      <span className="review-author">{review.author}</span>
                      {review.rating && (
                        <span className="review-rating">{review.rating}/10</span>
                      )}
                    </div>
                    <p className="review-content">{review.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
