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
  
  const moodSuggestions = [
    'Happy', 'Sad', 'Excited', 'Relaxed', 'Thoughtful',
    'Nostalgic', 'Adventurous', 'Romantic', 'Inspired',
    'Curious', 'Melancholic', 'Energetic'
  ];

  const handleMoodSubmit = async () => {
    if (!mood.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setShowMoodInput(false);
    setExplanation(null);
    
    try {
      // Get movie recommendations based on mood from OpenAI
      const recommendations = await getMoodBasedRecommendations(mood);
      setInterpretedMood(recommendations.mood);
      setExplanation(recommendations.explanation);
      
      // Use the movie titles to search for movie details using TMDB
      const moviePromises = recommendations.titles.map(title => 
        searchMovies(title, 1)
          .then(results => results.length > 0 ? results[0] : null)
          .catch(() => null)
      );
      
      const movieResults = await Promise.all(moviePromises);
      const validMovies = movieResults.filter(movie => movie !== null) as Movie[];
      
      if (validMovies.length === 0) {
        setError('Could not find details for the recommended movies');
      } else {
        onRecommendationsReceived(validMovies);
      }
    } catch (err) {
      setError('An error occurred while processing your mood');
      console.error(err);
      setShowMoodInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleMoodSubmit();
    }
  };

  const selectMoodSuggestion = (suggestion: string) => {
    setMood(suggestion);
  };

  const handleReset = () => {
    setShowMoodInput(true);
    setExplanation(null);
    setInterpretedMood(null);
  };

  if (!showMoodInput) {
    return (
      <div className="mood-processing">
        {explanation && interpretedMood && !setIsLoading && (
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
      <div className="mood-input-section">
        <h3>How are you feeling today?</h3>
        <p>Tell us your mood, and we'll recommend the perfect movies for you!</p>
        
        <div className="mood-input">
          <input
            type="text"
            placeholder="Describe your mood (e.g., 'feeling nostalgic')"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleMoodSubmit}>
            Get Recommendations
          </button>
        </div>
        
        <div className="mood-suggestions">
          <p>Or select a mood:</p>
          <div className="mood-tags">
            {moodSuggestions.map((suggestion) => (
              <span 
                key={suggestion} 
                className="mood-tag"
                onClick={() => selectMoodSuggestion(suggestion)}
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodBasedRecommendation;