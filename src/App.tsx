import { useState, useEffect } from 'react';
import './App.css';
import MovieCard from './components/MovieCard';
import { Movie } from './data/sampleMovies';
import { searchMovies, getPopularMovies } from './services/tmdbService';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load popular movies when the component mounts
  useEffect(() => {
    const loadPopularMovies = async () => {
      setIsLoading(true);
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
        setError(null);
      } catch (err) {
        setError('Failed to load popular movies');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularMovies();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchMovies(searchQuery);
      setMovies(results);
      if (results.length === 0) {
        setError('No movies found matching your search');
      }
    } catch (err) {
      setError('An error occurred while searching for movies');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Intelligent Movie Recommendations</h1>
        <p>Find the perfect film tailored to your taste with our precision recommendation engine.</p>
      </header>
      <div className="search-container">
        <div className="search-tabs">
          <button className="tab-button active">Quick Search</button>
          <button className="tab-button">Guided Discovery</button>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="What are you looking for?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>
            Find Movies
          </button>
        </div>
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
      
      <div className="movie-container">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard 
              key={movie.id}
              title={movie.title}
              subtitle={movie.subtitle}
              year={movie.year}
              genres={movie.genres}
              backgroundImage={movie.backgroundImage}
            />
          ))
        ) : !isLoading && !error && (
          <div className="no-results">
            <p>No movies to display. Try searching for something!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
