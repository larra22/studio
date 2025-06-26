"use client";

import { useState, useCallback, useRef, useEffect } from 'react';

export const useNotifications = (soundSrc: string) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(soundSrc);
    }
  }, [soundSrc]);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return;
    }
    const status = await Notification.requestPermission();
    setPermission(status);
  }, []);

  const sendNotification = useCallback((title: string, body?: string) => {
    if (permission === 'granted') {
      const notification = new Notification(title, { body });
    }
  }, [permission]);

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.error("Failed to play sound:", err));
    }
  }, []);

  return { requestPermission, sendNotification, playSound };
};
