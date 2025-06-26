'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SHA256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64url';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

const scope = 'user-read-private user-read-email playlist-read-private user-modify-playback-state user-read-playback-state';
const authUrl = new URL("https://accounts.spotify.com/authorize")

// Helper functions for PKCE
const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input: ArrayBuffer) => {
    return window.btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};


export const useSpotify = () => {
    const router = useRouter();
    const [tokens, setTokens] = useState<{accessToken: string, refreshToken: string, expiresAt: number} | null>(null);
    const [user, setUser] = useState<SpotifyApi.CurrentUsersProfileResponse | null>(null);
    const [playlists, setPlaylists] = useState<SpotifyApi.PlaylistObjectSimplified[] | null>(null);
    const [playerState, setPlayerState] = useState<SpotifyApi.CurrentPlaybackResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const clearLocalStorage = () => {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_expires_at');
        localStorage.removeItem('spotify_code_verifier');
    }

    const getTokensFromStorage = () => {
        const accessToken = localStorage.getItem('spotify_access_token');
        const refreshToken = localStorage.getItem('spotify_refresh_token');
        const expiresAt = localStorage.getItem('spotify_expires_at');
        if (accessToken && refreshToken && expiresAt) {
            return { accessToken, refreshToken, expiresAt: parseInt(expiresAt) };
        }
        return null;
    }
    
    const spotifyFetch = useCallback(async (endpoint: string, method = 'GET', body = null) => {
        let currentTokens = getTokensFromStorage();
        
        if (!currentTokens) {
            console.error("No tokens found");
            logout();
            return null;
        }

        // Check if token is expired or about to expire (in 60s)
        if (Date.now() >= currentTokens.expiresAt - 60 * 1000) {
            try {
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        grant_type: 'refresh_token',
                        refresh_token: currentTokens.refreshToken,
                        client_id: clientId!,
                    }),
                });

                if (!response.ok) throw new Error('Failed to refresh token');

                const newTokensData = await response.json();
                const newExpiresAt = Date.now() + newTokensData.expires_in * 1000;
                
                localStorage.setItem('spotify_access_token', newTokensData.access_token);
                localStorage.setItem('spotify_expires_at', newExpiresAt.toString());
                if (newTokensData.refresh_token) {
                    localStorage.setItem('spotify_refresh_token', newTokensData.refresh_token);
                }

                currentTokens = {
                    accessToken: newTokensData.access_token,
                    refreshToken: newTokensData.refresh_token || currentTokens.refreshToken,
                    expiresAt: newExpiresAt
                };
                setTokens(currentTokens);

            } catch (error) {
                console.error("Could not refresh token", error);
                logout(); // Log out if refresh fails
                return null;
            }
        }

        const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
            method,
            headers: { 'Authorization': `Bearer ${currentTokens.accessToken}` },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (res.status === 204) return true; // For commands like play/pause with no content
        if (res.status === 401) {
            console.error("Unauthorized, logging out");
            logout();
            return null;
        }
        if (!res.ok) {
            const error = await res.json();
            console.error(`Spotify API Error on ${endpoint}:`, error);
            return null;
        }
        return res.json();

    }, []);

    const login = async () => {
        if (!clientId || !redirectUri) {
            alert("Spotify Client ID or Redirect URI is not set. Please check your .env.local file.");
            return;
        }

        const codeVerifier = generateRandomString(64);
        const hashed = await sha256(codeVerifier);
        const codeChallenge = base64encode(hashed);

        localStorage.setItem('spotify_code_verifier', codeVerifier);
        
        const params =  {
          response_type: 'code',
          client_id: clientId,
          scope,
          code_challenge_method: 'S256',
          code_challenge: codeChallenge,
          redirect_uri: redirectUri,
        }
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    };

    const logout = () => {
        clearLocalStorage();
        setTokens(null);
        setUser(null);
        setPlaylists(null);
        setPlayerState(null);
        // Navigate back to the main page to clear any URL params
        router.push('/');
    };

    const getInitialTokens = useCallback(async (code: string, verifier: string) => {
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: clientId!,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: redirectUri!,
                    code_verifier: verifier,
                }),
            });
            if (!response.ok) throw new Error('Failed to get initial tokens');
            
            const data = await response.json();
            const expiresAt = Date.now() + data.expires_in * 1000;
            
            localStorage.setItem('spotify_access_token', data.access_token);
            localStorage.setItem('spotify_refresh_token', data.refresh_token);
            localStorage.setItem('spotify_expires_at', expiresAt.toString());

            setTokens({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                expiresAt,
            });

            // Clean up URL
            router.replace('/');

        } catch (error) {
            console.error("Error fetching tokens", error);
            logout();
        }
    }, [router]);


    // Effect to handle auth callback
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
            const verifier = localStorage.getItem('spotify_code_verifier');
            if(verifier) {
                getInitialTokens(code, verifier);
            } else {
                console.error("Code verifier not found in storage.");
            }
        }
    }, [getInitialTokens]);

    // Effect to load user data once we have tokens
    useEffect(() => {
        const storedTokens = getTokensFromStorage();
        if (storedTokens && Date.now() < storedTokens.expiresAt) {
            setTokens(storedTokens);
        }
        setIsLoading(false);
    }, []);

    // Effect to fetch user data and playlists once authenticated
    useEffect(() => {
        if (tokens && !user) {
            spotifyFetch('/me').then(profile => {
                if(profile) setUser(profile);
            });
            spotifyFetch('/me/playlists?limit=50').then(data => {
                if(data) setPlaylists(data.items);
            });
            const interval = setInterval(() => {
                spotifyFetch('/me/player').then(state => {
                    if (state) setPlayerState(state)
                });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [tokens, user, spotifyFetch]);


    // Player controls
    const play = (options: {context_uri?: string, uris?: string[]}) => spotifyFetch('/me/player/play', 'PUT', options);
    const pause = () => spotifyFetch('/me/player/pause', 'PUT');
    const next = () => spotifyFetch('/me/player/next', 'POST');
    const previous = () => spotifyFetch('/me/player/previous', 'POST');


    return { login, logout, user, playlists, playerState, isLoading, play, pause, next, previous };
};
