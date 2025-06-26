"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListMusic, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <title>Spotify</title>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.901 17.51c-.22.36-.679.48-1.04.26-2.909-1.78-6.52-2.19-10.859-1.21-.44.1-.88-.16-.98-.6-.1-.44.16-.88.6-.98 4.72-1.08 8.709-.61 11.969 1.36.361.22.48.68.26 1.04v-.03zm1.2-3.12c-.28.44-.82.6-1.26.32-3.24-1.98-7.92-2.52-12.09-1.38-.52.14-.96-.2-1.1-.72-.14-.52.2-.96.72-1.1 4.6-1.26 9.72-.66 13.38 1.56.44.28.6.82.32 1.26l-.02.06zm.12-3.24c-3.72-2.28-9.84-2.48-13.44-1.38-.6-.18-1.08-.72-1.02-1.32.12-.6.72-1.08 1.32-1.02 4.14-1.26 10.74-1.02 14.94 1.56.54.3.72.96.42 1.5-.3.54-.96.72-1.5.42v-.06z" />
  </svg>
);

const mockPlaylists = [
  { id: 1, name: 'Lofi Beats' },
  { id: 2, name: 'Deep Focus' },
  { id: 3, name: 'Ambient Chill' },
  { id: 4, name: 'Classical for Studying' },
];

export function FocusMusic() {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    name: '...',
    artist: '...',
  });

  // In a real app, this would trigger the Spotify OAuth flow
  const handleConnect = () => {
    setIsConnected(true);
    setCurrentTrack({ name: 'Rainy Day', artist: 'Lofi Chill' });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setIsPlaying(false);
    setCurrentTrack({ name: '...', artist: '...' });
  };

  const handleSelectPlaylist = (playlistName: string) => {
    // In a real app, this would fetch tracks from the selected playlist
    console.log(`Selected playlist: ${playlistName}`);
    setCurrentTrack({ name: 'First song from ' + playlistName, artist: 'Various Artists' });
    setIsPlaying(true);
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Focus Music</CardTitle>
          <CardDescription>Connect to Spotify to play music for your work session.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
          <SpotifyIcon className="w-16 h-16 text-[#1DB954]" />
          <Button onClick={handleConnect} className="bg-[#1DB954] hover:bg-[#1ED760] text-white font-bold">
            <SpotifyIcon className="w-5 h-5 mr-2" />
            Connect to Spotify
          </Button>
            <p className="text-xs text-muted-foreground text-center pt-4">
            This is a mock integration. Clicking connect will show a sample player.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spotify Playlists</CardTitle>
        <CardDescription>Select a playlist to start listening.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {mockPlaylists.map((playlist) => (
            <li key={playlist.id}>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleSelectPlaylist(playlist.name)}
              >
                <ListMusic className="mr-2 h-4 w-4" />
                {playlist.name}
              </Button>
            </li>
          ))}
        </ul>
          <div className="border-t pt-4 mt-4 space-y-3">
          <div className="text-center">
            <p className="font-semibold">{currentTrack.name}</p>
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
          </div>
          <div className="flex items-center justify-center space-x-4">
              <Button variant="ghost" size="icon" disabled>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" className="w-12 h-12" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
              <Button variant="ghost" size="icon" disabled>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Button onClick={handleDisconnect} variant="link" className="w-full text-muted-foreground">
          Disconnect Spotify
        </Button>
      </CardContent>
    </Card>
  );
}
