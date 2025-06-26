"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw } from 'lucide-react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  minutes: number;
  mode: TimerMode;
  onComplete: () => void;
  onReset: () => void;
}

export function PomodoroTimer({ minutes, mode, onComplete, onReset }: PomodoroTimerProps) {
  const totalSeconds = minutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(seconds => seconds - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      setIsActive(false);
      onComplete();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, onComplete]);

  useEffect(() => {
    setSecondsLeft(minutes * 60);
    setIsActive(false);
  }, [minutes]);
  
  const toggleTimer = () => {
    if (secondsLeft > 0) {
      setIsActive(!isActive);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeText = () => {
    switch(mode) {
      case 'work': return 'Focus';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
    }
  }

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg space-y-6">
      <div className="text-center">
        <p className="text-2xl font-semibold text-accent">{getModeText()}</p>
        <p className="text-8xl md:text-9xl font-bold font-headline tabular-nums text-primary tracking-tighter">
          {formatTime(secondsLeft)}
        </p>
      </div>
      
      <Progress value={progress} className="w-full h-3" />

      <div className="flex space-x-4">
        <Button onClick={toggleTimer} size="lg" className="w-36" variant={isActive ? 'secondary' : 'default'} disabled={secondsLeft === 0}>
          {isActive ? <Pause className="mr-2"/> : <Play className="mr-2"/>}
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={onReset} size="lg" variant="outline">
            <RotateCcw className="mr-2"/>
            Reset
        </Button>
      </div>
    </div>
  );
}
