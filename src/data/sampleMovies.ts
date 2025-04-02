export interface Movie {
  id: number;
  title: string;
  subtitle?: string;
  year: number;
  genres: string[];
  posterUrl?: string;
  backgroundImage?: string;
}

export const sampleMovies: Movie[] = [
  {
    id: 1,
    title: "BOHEMIAN RHAPSODY",
    subtitle: "The Secret Life of Walter Mitty",
    year: 2013,
    genres: ["Adventure", "Comedy"],
    backgroundImage: "https://m.media-amazon.com/images/M/MV5BODYwNDYxNDk1Nl5BMl5BanBnXkFtZTgwOTAwMTk2MDE@._V1_.jpg"
  },
  {
    id: 2,
    title: "INCEPTION",
    year: 2010,
    genres: ["Sci-Fi", "Action", "Thriller"],
    backgroundImage: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg"
  },
  {
    id: 3,
    title: "INTERSTELLAR",
    year: 2014,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    backgroundImage: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg"
  },
  {
    id: 4,
    title: "THE DARK KNIGHT",
    year: 2008,
    genres: ["Action", "Crime", "Drama"],
    backgroundImage: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg"
  }
];
