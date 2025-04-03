// In Vite, environment variables must be prefixed with VITE_
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'your-api-key-here';

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
export const getMoodBasedRecommendations = async (mood: string, count: number = 6): Promise<MoodBasedMovieRecommendation> => {
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
