"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ListMusic, Play, Pause, SkipBack, SkipForward, User } from 'lucide-react';
import { useSpotify } from '@/hooks/use-spotify';
import { ScrollArea } from './ui/scroll-area';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
    <title>Spotify</title>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.901 17.51c-.22.36-.679.48-1.04.26-2.909-1.78-6.52-2.19-10.859-1.21-.44.1-.88-.16-.98-.6-.1-.44.16-.88.6-.98 4.72-1.08 8.709-.61 11.969 1.36.361.22.48.68.26 1.04v-.03zm1.2-3.12c-.28.44-.82.6-1.26.32-3.24-1.98-7.92-2.52-12.09-1.38-.52.14-.96-.2-1.1-.72-.14-.52.2-.96.72-1.1 4.6-1.26 9.72-.66 13.38 1.56.44.28.6.82.32 1.26l-.02.06zm.12-3.24c-3.72-2.28-9.84-2.48-13.44-1.38-.6-.18-1.08-.72-1.02-1.32.12-.6.72-1.08 1.32-1.02 4.14-1.26 10.74-1.02 14.94 1.56.54.3.72.96.42 1.5-.3.54-.96.72-1.5.42v-.06z" />
  </svg>
);

export function FocusMusic() {
  const { 
    login, 
    logout, 
    user, 
    playlists, 
    playerState, 
    play, 
    pause, 
    next, 
    previous 
  } = useSpotify();

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Focus Music</CardTitle>
          <CardDescription>Connect to Spotify to play music for your work session.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
          <SpotifyIcon className="w-16 h-16 text-[#1DB954]" />
          <Button onClick={login} className="bg-[#1DB954] hover:bg-[#1ED760] text-white font-bold">
            <SpotifyIcon className="w-5 h-5 mr-2" />
            Connect to Spotify
          </Button>
          <p className="text-xs text-muted-foreground text-center pt-4">
            You'll be redirected to Spotify to authorize this app.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Spotify Playlists</CardTitle>
                <CardDescription>Logged in as {user.display_name}</CardDescription>
            </div>
            <Button onClick={logout} variant="link" className="text-muted-foreground text-xs p-0 h-auto">
                Logout
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-64">
          <ul className="space-y-1 pr-4">
            {playlists ? playlists.map((playlist) => (
              <li key={playlist.id}>
                <button
                  className="w-full flex items-center gap-3 text-left p-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => play({ context_uri: playlist.uri })}
                >
                  <Image 
                    src={playlist.images?.[0]?.url || 'https://placehold.co/64x64.png'} 
                    alt={playlist.name} 
                    width={40} 
                    height={40} 
                    className="rounded-sm"
                    data-ai-hint="playlist cover"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium truncate">{playlist.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{playlist.tracks.total} tracks</p>
                  </div>
                </button>
              </li>
            )) : (
              // Skeleton loader
              Array.from({length: 5}).map((_, i) => (
                <li key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-10 w-10 rounded-sm" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </li>
              ))
            )}
          </ul>
        </ScrollArea>
        {playerState && playerState.item ? (
           <div className="border-t pt-4 mt-4 space-y-3">
             <div className="flex items-center gap-3">
                <Image 
                    src={playerState.item.album.images[0].url} 
                    alt={playerState.item.album.name}
                    width={56}
                    height={56}
                    className="rounded-md"
                    data-ai-hint="album cover"
                />
                <div className='overflow-hidden'>
                    <p className="font-semibold truncate">{playerState.item.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{playerState.item.artists.map(a => a.name).join(', ')}</p>
                </div>
             </div>
             <div className="flex items-center justify-center space-x-2">
                 <Button variant="ghost" size="icon" onClick={previous} disabled={!playerState?.actions.disallows.skipping_prev}>
                    <SkipBack className="h-5 w-5" />
                 </Button>
                 <Button size="icon" className="w-12 h-12" onClick={() => playerState.is_playing ? pause() : play({})}>
                    {playerState.is_playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                 </Button>
                 <Button variant="ghost" size="icon" onClick={next} disabled={!playerState?.actions.disallows.skipping_next}>
                    <SkipForward className="h-5 w-5" />
                 </Button>
             </div>
           </div>
        ) : (
            <div className="border-t pt-4 mt-4 text-center text-sm text-muted-foreground">
                Select a playlist to start playing music on your active Spotify device.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
