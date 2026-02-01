import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Topics pool for content generation
const topics = [
  'Technology', 'Science', 'History', 'Geography', 'Pop Culture',
  'Sports', 'Nature', 'Space', 'Health', 'Food', 'Art', 'Music',
  'Movies', 'Literature', 'Politics', 'Economics', 'Psychology',
  'Environment', 'Animals', 'Inventions'
];

// Unsplash API for random images
const getRandomImage = async (topic: string): Promise<string> => {
  try {
    const query = topic.toLowerCase().replace(/\s+/g, '-');
    // Using Unsplash Source for random images
    return `https://source.unsplash.com/800x1200/?${query},abstract,gradient`;
  } catch (error) {
    return 'https://source.unsplash.com/800x1200/?abstract,gradient';
  }
};

export async function POST() {
  try {
    // Select a random topic
    const topic = topics[Math.floor(Math.random() * topics.length)];

    // Generate content using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a content creator for RokTok, a TikTok-style educational app. Generate engaging, interesting facts or news with a quiz question.
          
          Your response MUST be in this exact JSON format:
          {
            "content": "A fascinating fact, news item, or piece of information (1-3 sentences, engaging and interesting)",
            "question": "A quiz question based on the content",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0
          }
          
          The correctAnswer should be the index (0-3) of the correct option.
          Make the content engaging, surprising, and educational.
          The question should be directly related to the content provided.
          Make sure all 4 options are plausible but only one is correct.`
        },
        {
          role: 'user',
          content: `Create an interesting fact or news item about: ${topic}`
        }
      ],
      temperature: 0.9,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate the response structure
    if (
      !parsedResponse.content ||
      !parsedResponse.question ||
      !Array.isArray(parsedResponse.options) ||
      parsedResponse.options.length !== 4 ||
      typeof parsedResponse.correctAnswer !== 'number' ||
      parsedResponse.correctAnswer < 0 ||
      parsedResponse.correctAnswer > 3
    ) {
      throw new Error('Invalid response structure from OpenAI');
    }

    // Get a random image related to the topic
    const imageUrl = await getRandomImage(topic);

    return NextResponse.json({
      content: parsedResponse.content,
      question: parsedResponse.question,
      options: parsedResponse.options,
      correctAnswer: parsedResponse.correctAnswer,
      imageUrl: imageUrl,
      topic: topic,
    });

  } catch (error) {
    console.error('Error generating content:', error);
    
    // Return a fallback response if OpenAI fails
    return NextResponse.json({
      content: 'The Great Wall of China is not visible from space with the naked eye, despite popular belief. This myth has been debunked by astronauts.',
      question: 'Can the Great Wall of China be seen from space with the naked eye?',
      options: [
        'Yes, clearly visible',
        'No, it\'s a myth',
        'Only during full moon',
        'Yes, but only from low orbit'
      ],
      correctAnswer: 1,
      imageUrl: 'https://source.unsplash.com/800x1200/?china,wall,architecture',
      topic: 'History',
    });
  }
}
