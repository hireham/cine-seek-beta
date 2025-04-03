import React, { useState } from 'react';
import { Movie } from '../data/sampleMovies';
import '../styles/MoodBasedRecommendation.css';
import { getMoodBasedRecommendations } from '../services/openaiService';
import { searchMovies } from '../services/tmdbService';

interface MoodBasedRecommendationProps {
  onRecommendationsReceived: (movies: Movie[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const MoodBasedRecommendation: React.FC<MoodBasedRecommendationProps> = ({
  onRecommendationsReceived,
  setIsLoading,
  setError
}) => {
  const [mood, setMood] = useState('');
  const [showMoodInput, setShowMoodInput] = useState(true);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [interpretedMood, setInterpretedMood] = useState<string | null>(null);

  const handleMoodSubmit = async () => {
    if (!mood.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setShowMoodInput(false);
    setExplanation(null);
    
    try {
      console.log('Getting recommendations for mood:', mood);
      
      // Get movie recommendations based on mood from OpenAI
      let movieTitles: string[] = [];
      
      try {
        const recommendations = await getMoodBasedRecommendations(mood);
        console.log('Received recommendations:', recommendations);
        
        setInterpretedMood(recommendations.mood);
        setExplanation(recommendations.explanation);
        movieTitles = recommendations.titles;
      } catch (apiError) {
        console.error('OpenAI API error:', apiError);
        // Fallback recommendations for nostalgic/melancholic mood
        const fallbackRecommendations = {
          titles: ["The Shawshank Redemption", "Forrest Gump", "Cinema Paradiso", "Stand By Me", "The Princess Bride"],
          mood: "nostalgic",
          explanation: "These classic films evoke feelings of nostalgia and wonder, perfect for when you're feeling reflective about the past."
        };
        setInterpretedMood(fallbackRecommendations.mood);
        setExplanation(fallbackRecommendations.explanation);
        movieTitles = fallbackRecommendations.titles;
      }
      
      // Use the movie titles to search for movie details using TMDB
      console.log('Searching for movies with titles:', movieTitles);
      
      const moviePromises = movieTitles.map((title: string) => 
        searchMovies(title, 1)
          .then(results => {
            console.log(`Search results for "${title}":`, results);
            return results.length > 0 ? results[0] : null;
          })
          .catch(error => {
            console.error(`Error searching for "${title}":`, error);
            return null;
          })
      );
      
      const movieResults = await Promise.all(moviePromises);
      console.log('All movie results:', movieResults);
      
      const validMovies = movieResults.filter((movie: any) => movie !== null) as Movie[];
      console.log('Valid movies:', validMovies);
      
      if (validMovies.length === 0) {
        setError('Could not find details for the recommended movies');
      } else {
        onRecommendationsReceived(validMovies);
      }
    } catch (err) {
      setError('An error occurred while processing your mood');
      console.error('Error in handleMoodSubmit:', err);
      setShowMoodInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      handleMoodSubmit();
    }
  };

  const handleReset = () => {
    setShowMoodInput(true);
    setExplanation(null);
    setInterpretedMood(null);
  };

  if (!showMoodInput) {
    return (
      <div className="mood-processing">
        {explanation && interpretedMood && (
          <div className="recommendation-explanation">
            <h3>Based on your "{interpretedMood}" mood:</h3>
            <p>{explanation}</p>
          </div>
        )}
        <button 
          className="back-button"
          onClick={handleReset}
        >
          Try a different mood
        </button>
      </div>
    );
  }

  return (
    <div className="mood-recommendation-container">
      <div className="mood-card">
        <div className="mood-input-section">
          <h3>How are you feeling today?</h3>
          <p>Be detailed about your feelings for better recommendations</p>
          
          <div className="mood-input">
          <textarea
            placeholder="Describe your current mood or emotional state..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
          />
          </div>
          
          <button 
            className="get-recommendations-button"
            onClick={handleMoodSubmit}
          >
            Get Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodBasedRecommendation;
