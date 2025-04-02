import { Movie } from '../data/sampleMovies';

const API_KEY = '101b3221b6a4c7ed79ca9dca8a4e3e70';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Interface for TMDB API response
interface TmdbMovieResponse {
  results: TmdbMovie[];
  page: number;
  total_results: number;
  total_pages: number;
}

// Interface for TMDB movie object
interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  genre_ids: number[];
}

// Genre mapping from TMDB genre IDs to genre names
const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Convert TMDB movie to our Movie interface
const convertTmdbMovie = (tmdbMovie: TmdbMovie): Movie => {
  const year = tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : 0;
  const genres = tmdbMovie.genre_ids.map(id => genreMap[id] || 'Unknown').slice(0, 3);
  
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    subtitle: tmdbMovie.overview.substring(0, 50) + (tmdbMovie.overview.length > 50 ? '...' : ''),
    year,
    genres,
    posterUrl: tmdbMovie.poster_path ? `${IMAGE_BASE_URL}${tmdbMovie.poster_path}` : undefined,
    backgroundImage: tmdbMovie.backdrop_path ? `${IMAGE_BASE_URL}${tmdbMovie.backdrop_path}` : undefined
  };
};

// Search movies by query
export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) {
    return [];
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data: TmdbMovieResponse = await response.json();
    return data.results.map(convertTmdbMovie);
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// Get popular movies
export const getPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data: TmdbMovieResponse = await response.json();
    return data.results.map(convertTmdbMovie);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};
