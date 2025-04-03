export interface Movie {
  id: number;
  title: string;
  subtitle?: string;
  year: number;
  genres: string[];
  posterUrl?: string;
  backgroundImage?: string;
}
