import { useState } from 'react';
import './App.css';
import MoodBasedRecommendation from './components/MoodBasedRecommendation';
import { Movie } from './data/sampleMovies';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

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
              <div key={movie.id} className="movie-card">
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
    </div>
  );
}

export default App;
