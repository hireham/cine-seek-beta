import OpenAI from 'openai';

// In Vite, environment variables must be prefixed with VITE_
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Set to true if you are using this in a browser environment
});

// Sentiment types
export type Sentiment = 'positive' | 'negative' | 'neutral';

// Interface for the sentiment analysis result
export interface SentimentAnalysisResult {
  sentiment: Sentiment;
  confidence: number;
  reviewText: string;
}

// Interface for mood-based movie recommendation
export interface MoodBasedMovieRecommendation {
  titles: string[];
  mood: string;
  explanation: string;
}

/**
 * Gets movie recommendations based on the user's mood
 * @param mood The user's current mood or emotional state
 * @param count Number of movie recommendations to return
 * @returns A promise that resolves to movie titles based on the mood
 */
export const getMoodBasedRecommendations = async (mood: string, count: number = 5): Promise<MoodBasedMovieRecommendation> => {
  if (!mood.trim()) {
    throw new Error('Mood description cannot be empty');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a movie recommendation expert. Based on the user's mood, suggest ${count} movie titles that would best match their emotional state. 
            Respond in JSON format with the following structure:
            {
              "titles": ["Movie Title 1", "Movie Title 2", ...],
              "mood": "interpreted mood",
              "explanation": "brief explanation of why these movies fit the mood"
            }
            Only include the movie titles without years or additional information - just the exact titles as they would appear in a movie database.`,
          },
          {
            role: 'user',
            content: `I'm feeling ${mood}. What movies would you recommend?`,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    try {
      const recommendationData = JSON.parse(content);
      return {
        titles: recommendationData.titles || [],
        mood: recommendationData.mood || mood,
        explanation: recommendationData.explanation || ''
      };
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse movie recommendations');
    }
  } catch (error) {
    console.error('Error getting movie recommendations:', error);
    throw new Error(`Failed to get recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Analyzes the sentiment of a movie review using OpenAI's API
 * @param reviewText The movie review text to analyze
 * @returns A promise that resolves to a SentimentAnalysisResult
 */
export const analyzeSentiment = async (reviewText: string): Promise<SentimentAnalysisResult> => {
  if (!reviewText.trim()) {
    throw new Error('Review text cannot be empty');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: "You are a sentiment analysis expert. Analyze the sentiment of the movie review and respond with only one word: 'positive', 'negative', or 'neutral'. Also include a confidence score between 0 and 1.",
          },
          {
            role: 'user',
            content: `Analyze the sentiment of this movie review: "${reviewText}"`,
          },
        ],
        temperature: 0.3,
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.toLowerCase() || '';

    // Extract sentiment and confidence from the response
    let sentiment: Sentiment = 'neutral';
    let confidence = 0.5;

    if (content.includes('positive')) {
      sentiment = 'positive';
    } else if (content.includes('negative')) {
      sentiment = 'negative';
    }

    const confidenceMatch = content.match(/(\d+(\.\d+)?)/);
    if (confidenceMatch) {
      const extractedConfidence = parseFloat(confidenceMatch[0]);
      if (!isNaN(extractedConfidence) && extractedConfidence >= 0 && extractedConfidence <= 1) {
        confidence = extractedConfidence;
      }
    }

    return {
      sentiment,
      confidence,
      reviewText,
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error(`Failed to analyze sentiment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Alternative implementation using fetch API if you don't want to install the OpenAI SDK
 */
export const analyzeSentimentWithFetch = async (reviewText: string): Promise<SentimentAnalysisResult> => {
  if (!reviewText.trim()) {
    throw new Error('Review text cannot be empty');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a sentiment analysis expert. Analyze the sentiment of the movie review and respond with only one word: 'positive', 'negative', or 'neutral'. Also include a confidence score between 0 and 1."
          },
          {
            role: "user",
            content: `Analyze the sentiment of this movie review: "${reviewText}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 50,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.toLowerCase() || '';
    
    // Extract sentiment and confidence from the response
    let sentiment: Sentiment = 'neutral';
    let confidence = 0.5;
    
    if (content.includes('positive')) {
      sentiment = 'positive';
    } else if (content.includes('negative')) {
      sentiment = 'negative';
    }
    
    // Try to extract confidence score if present
    const confidenceMatch = content.match(/(\d+(\.\d+)?)/);
    if (confidenceMatch) {
      const extractedConfidence = parseFloat(confidenceMatch[0]);
      if (!isNaN(extractedConfidence) && extractedConfidence >= 0 && extractedConfidence <= 1) {
        confidence = extractedConfidence;
      }
    }

    return {
      sentiment,
      confidence,
      reviewText
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw new Error(`Failed to analyze sentiment: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Example usage:
 * 
 * // Using the OpenAI SDK
 * const result = await analyzeSentiment("This movie was absolutely fantastic! The acting was superb and the plot kept me engaged throughout.");
 * console.log(result); // { sentiment: 'positive', confidence: 0.95, reviewText: '...' }
 * 
 * // Using fetch API
 * const result2 = await analyzeSentimentWithFetch("I was really disappointed with this film. The characters were poorly developed and the story made no sense.");
 * console.log(result2); // { sentiment: 'negative', confidence: 0.87, reviewText: '...' }
 */
