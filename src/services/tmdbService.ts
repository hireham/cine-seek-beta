import { Movie } from '../data/sampleMovies';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '101b3221b6a4c7ed79ca9dca8a4e3e70';
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

// Interface for detailed movie information
export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  posterUrl?: string;
  backdropUrl?: string;
  releaseDate: string;
  runtime?: number;
  voteAverage: number;
  genres: string[];
  cast: {
    id: number;
    name: string;
    character: string;
    profileUrl?: string;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
  }[];
  reviews: {
    id: string;
    author: string;
    content: string;
    rating?: number;
  }[];
}

// Interface for TMDB movie details response
interface TmdbMovieDetailsResponse {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  genres: { id: number; name: string }[];
}

// Interface for TMDB credits response
interface TmdbCreditsResponse {
  id: number;
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    department: string;
  }[];
}

// Interface for TMDB reviews response
interface TmdbReviewsResponse {
  id: number;
  results: {
    id: string;
    author: string;
    content: string;
    author_details: {
      rating: number | null;
    };
  }[];
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
export const searchMovies = async (query: string, limit?: number): Promise<Movie[]> => {
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
    const results = data.results.map(convertTmdbMovie);
    
    // If a limit is specified, only return that many results
    if (limit && results.length > limit) {
      return results.slice(0, limit);
    }
    
    return results;
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

// Get detailed movie information by ID
export const getMovieDetails = async (movieId: number): Promise<MovieDetails | null> => {
  try {
    // Fetch movie details
    const detailsResponse = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
    );
    
    if (!detailsResponse.ok) {
      throw new Error(`TMDB API error: ${detailsResponse.status}`);
    }
    
    const detailsData: TmdbMovieDetailsResponse = await detailsResponse.json();
    
    // Fetch credits (cast and crew)
    const creditsResponse = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=en-US`
    );
    
    if (!creditsResponse.ok) {
      throw new Error(`TMDB API error: ${creditsResponse.status}`);
    }
    
    const creditsData: TmdbCreditsResponse = await creditsResponse.json();
    
    // Fetch reviews
    const reviewsResponse = await fetch(
      `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}&language=en-US&page=1`
    );
    
    if (!reviewsResponse.ok) {
      throw new Error(`TMDB API error: ${reviewsResponse.status}`);
    }
    
    const reviewsData: TmdbReviewsResponse = await reviewsResponse.json();
    
    // Combine all data into a single MovieDetails object
    return {
      id: detailsData.id,
      title: detailsData.title,
      overview: detailsData.overview,
      posterUrl: detailsData.poster_path ? `${IMAGE_BASE_URL}${detailsData.poster_path}` : undefined,
      backdropUrl: detailsData.backdrop_path ? `${IMAGE_BASE_URL}${detailsData.backdrop_path}` : undefined,
      releaseDate: detailsData.release_date,
      runtime: detailsData.runtime || undefined,
      voteAverage: detailsData.vote_average,
      genres: detailsData.genres.map(genre => genre.name),
      cast: creditsData.cast.slice(0, 10).map(castMember => ({
        id: castMember.id,
        name: castMember.name,
        character: castMember.character,
        profileUrl: castMember.profile_path ? `${IMAGE_BASE_URL}${castMember.profile_path}` : undefined
      })),
      crew: creditsData.crew
        .filter(crewMember => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(crewMember.job))
        .map(crewMember => ({
          id: crewMember.id,
          name: crewMember.name,
          job: crewMember.job,
          department: crewMember.department
        })),
      reviews: reviewsData.results.map(review => ({
        id: review.id,
        author: review.author,
        content: review.content,
        rating: review.author_details.rating || undefined
      }))
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};
