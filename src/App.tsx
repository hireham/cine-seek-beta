import { useState, useEffect } from 'react';
import './App.css';
import MoodBasedRecommendation from './components/MoodBasedRecommendation';
import MovieDetails from './components/MovieDetails';
import { Movie } from './data/sampleMovies';
import { MovieDetails as MovieDetailsType, getMovieDetails } from './services/tmdbService';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [movieDetails, setMovieDetails] = useState<MovieDetailsType | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (selectedMovieId) {
        setIsDetailsLoading(true);
        try {
          const details = await getMovieDetails(selectedMovieId);
          setMovieDetails(details);
        } catch (error) {
          console.error('Error fetching movie details:', error);
          setMovieDetails(null);
        } finally {
          setIsDetailsLoading(false);
        }
      }
    };

    fetchMovieDetails();
  }, [selectedMovieId]);

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseDetails = () => {
    setSelectedMovieId(null);
    setMovieDetails(null);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Cineseek</h1>
        <p>Discover films perfectly matched to your current mood. Our intelligent system analyzes your emotional state and curates a personalized film experience just for you.</p>
      </header>
      
      <div className="mood-container">
        <MoodBasedRecommendation 
          onRecommendationsReceived={(movies: Movie[]) => setRecommendations(movies)}
          setIsLoading={setIsLoading}
          setError={setError}
        />
      </div>
      
      {isLoading && (
        <div className="loading-container">
          <p>Loading movies...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <p>{error}</p>
        </div>
      )}
      
      {recommendations.length > 0 && (
        <div className="recommendations-container">
          <h2>Your Movie Recommendations</h2>
          <div className="movie-grid">
            {recommendations.map(movie => (
              <div 
                key={movie.id} 
                className="movie-card" 
                onClick={() => handleMovieClick(movie.id)}
              >
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
                ) : (
                  <div className="movie-poster-placeholder">{movie.title}</div>
                )}
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.year}</p>
                  <div className="movie-genres">
                    {movie.genres.map((genre, index) => (
                      <span key={index} className="genre-tag">{genre}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMovieId && (
        <MovieDetails 
          movieDetails={movieDetails}
          onClose={handleCloseDetails}
          isLoading={isDetailsLoading}
        />
      )}
    </div>
  );
}

export default App;
