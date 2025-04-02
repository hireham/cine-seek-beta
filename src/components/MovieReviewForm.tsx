import React, { useState } from 'react';
import { analyzeSentiment } from '../services/openaiService';

const MovieReviewForm: React.FC = () => {
  const [reviewText, setReviewText] = useState('');
  const [sentimentResult, setSentimentResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError('Please enter a review.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSentimentResult(null);

    try {
      const result = await analyzeSentiment(reviewText);
      setSentimentResult(
        `Sentiment: ${result.sentiment.toUpperCase()}, Confidence: ${(result.confidence * 100).toFixed(2)}%`
      );
    } catch (err) {
      setError('Failed to analyze sentiment. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h2>Submit a Movie Review</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your movie review here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={5}
          cols={50}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Submit Review'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {sentimentResult && <p className="sentiment-result">{sentimentResult}</p>}
    </div>
  );
};

export default MovieReviewForm;