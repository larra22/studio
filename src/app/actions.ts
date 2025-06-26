'use server';

import { getFocusMusicRecommendations } from '@/ai/flows/focus-music-recommendations';
import { z } from 'zod';

const schema = z.object({
  musicPreferences: z.string().min(3, { message: 'Preferences must be at least 3 characters long.' }),
});

export async function getMusicRecommendationsAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = schema.safeParse({
    musicPreferences: formData.get('musicPreferences'),
  });

  if (!validatedFields.success) {
    return {
      recommendations: [],
      error: validatedFields.error.flatten().fieldErrors.musicPreferences?.join(', '),
    };
  }
  
  try {
    const result = await getFocusMusicRecommendations({ 
      musicPreferences: validatedFields.data.musicPreferences 
    });
    if (result && result.recommendations) {
      return { recommendations: result.recommendations, error: null };
    }
    return { recommendations: [], error: 'Could not get recommendations.' };
  } catch (error) {
    console.error(error);
    return { recommendations: [], error: 'An unexpected error occurred.' };
  }
}
