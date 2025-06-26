"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { PomodoroTimer } from '@/components/pomodoro-timer';
import { TaskManager } from '@/components/task-manager';
import { FocusMusic } from '@/components/focus-music';
import { useNotifications } from '@/hooks/use-notifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, Music, Settings, LogOut, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export default function Home() {
  const [mode, setMode] = useState<TimerMode>('work');
  const [pomodoros, setPomodoros] = useState(0);
  const [key, setKey] = useState(0); 

  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [tasks, setTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const { requestPermission, sendNotification, playSound } = useNotifications('/alarm.mp3');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage is only available on the client side.
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      router.replace('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  useEffect(() => {
    if (!isLoading) {
      requestPermission();
    }
  }, [requestPermission, isLoading]);

  useEffect(() => {
    if (isLoading) return; // Don't run localStorage effects until authenticated
    const savedTasks = localStorage.getItem('tomato-time-tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) setTasks(parsed);
      } catch (e) {
        console.error("Failed to parse tasks from localStorage", e);
      }
    }
    
    const savedCompletedTasks = localStorage.getItem('tomato-time-completed-tasks');
    if (savedCompletedTasks) {
      try {
        const parsed = JSON.parse(savedCompletedTasks);
        if (Array.isArray(parsed)) setCompletedTasks(parsed);
      } catch (e) {
        console.error("Failed to parse completed tasks from localStorage", e);
      }
    }
    
    setIsMounted(true);
  }, [isLoading]);

  useEffect(() => {
    if (isMounted && !isLoading) {
      localStorage.setItem('tomato-time-tasks', JSON.stringify(tasks));
      localStorage.setItem('tomato-time-completed-tasks', JSON.stringify(completedTasks));
    }
  }, [tasks, completedTasks, isMounted, isLoading]);

  const handleTimerComplete = useCallback(() => {
    playSound();
    if (mode === 'work') {
      sendNotification('Work session complete!', 'Time for a break.');
      const newPomodoros = pomodoros + 1;
      setPomodoros(newPomodoros);
      if (newPomodoros > 0 && newPomodoros % longBreakInterval === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      sendNotification('Break is over!', 'Time to get back to work.');
      setMode('work');
    }
    setKey(prevKey => prevKey + 1);
  }, [mode, pomodoros, longBreakInterval, playSound, sendNotification]);

  const getMinutes = () => {
    switch (mode) {
      case 'work':
        return workMinutes;
      case 'shortBreak':
        return shortBreakMinutes;
      case 'longBreak':
        return longBreakMinutes;
      default:
        return workMinutes;
    }
  };
  
  const resetCycle = () => {
    setPomodoros(0);
    setMode('work');
    setKey(prevKey => prevKey + 1);
  }

  const handleSettingsSave = () => {
    resetCycle();
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 md:p-8 font-body">
      <div className="w-full max-w-md relative flex items-center justify-center">
        <Header />
        <Button onClick={handleLogout} variant="ghost" size="icon" className="absolute top-1/2 -translate-y-1/2 right-0">
          <LogOut className="h-6 w-6" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
      <main className="w-full max-w-md mx-auto mt-8">
        <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-lg shadow-primary/20">
          <CardContent className="p-4 md:p-6">
            <PomodoroTimer
              key={key}
              minutes={getMinutes()}
              mode={mode}
              onComplete={handleTimerComplete}
              onReset={resetCycle}
            />
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="tasks" className="gap-1"><ListTodo className="h-4 w-4" />Tasks</TabsTrigger>
              <TabsTrigger value="music" className="gap-1"><Music className="h-4 w-4" />Music</TabsTrigger>
              <TabsTrigger value="settings" className="gap-1"><Settings className="h-4 w-4" />Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks" className="mt-4">
              <TaskManager tasks={tasks} setTasks={setTasks} completedTasks={completedTasks} setCompletedTasks={setCompletedTasks} />
            </TabsContent>
            <TabsContent value="music" className="mt-4">
              <FocusMusic />
            </TabsContent>
            <TabsContent value="settings" className="mt-4">
              <Card>
                <CardContent className="p-6 grid gap-6">
                  <h3 className="text-lg font-medium text-center">Timer Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="work-minutes">Work</Label>
                      <Input id="work-minutes" type="number" value={workMinutes} onChange={e => setWorkMinutes(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="short-break-minutes">Short Break</Label>
                      <Input id="short-break-minutes" type="number" value={shortBreakMinutes} onChange={e => setShortBreakMinutes(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="long-break-minutes">Long Break</Label>
                      <Input id="long-break-minutes" type="number" value={longBreakMinutes} onChange={e => setLongBreakMinutes(Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="long-break-interval">Pomodoros for long break</Label>
                      <Input id="long-break-interval" type="number" value={longBreakInterval} onChange={e => setLongBreakInterval(Number(e.target.value))} />
                  </div>
                  <Button onClick={handleSettingsSave}>Save and Reset Cycle</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
