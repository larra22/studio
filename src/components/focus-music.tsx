"use client";

import { useActionState, useState } from 'react';
import { getMusicRecommendationsAction } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';

const initialState = {
  recommendations: [],
  error: null,
};

export function FocusMusic() {
  const [state, formAction, isPending] = useActionState(getMusicRecommendationsAction, initialState);
  const [preferences, setPreferences] = useState('');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Focus Music</CardTitle>
        <CardDescription>Get AI-powered music recommendations for your work session.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Textarea
            name="musicPreferences"
            placeholder="e.g., 'calm instrumental piano', 'lo-fi beats', 'epic orchestral scores for coding'"
            value={preferences}
            onChange={e => setPreferences(e.target.value)}
            rows={3}
            required
            className="text-base"
          />
          <Button type="submit" disabled={isPending || !preferences.trim()}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Get Recommendations
          </Button>
        </form>

        {state.error && (
          <p className="mt-4 text-destructive">{state.error}</p>
        )}

        {state.recommendations && state.recommendations.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Here are some suggestions:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {state.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
