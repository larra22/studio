"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TaskManagerProps {
  tasks: string[];
  setTasks: Dispatch<SetStateAction<string[]>>;
  completedTasks: string[];
  setCompletedTasks: Dispatch<SetStateAction<string[]>>;
}

export function TaskManager({ tasks, setTasks, completedTasks, setCompletedTasks }: TaskManagerProps) {
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      setTasks(prev => [...prev, newTask.trim()]);
      setNewTask('');
    }
  };

  const handleCompleteTask = (taskToComplete: string) => {
    setTasks(prev => prev.filter(task => task !== taskToComplete));
    setCompletedTasks(prev => [taskToComplete, ...prev]);
  };
  
  const handleUncompleteTask = (taskToUncomplete: string) => {
    setCompletedTasks(prev => prev.filter(task => task !== taskToUncomplete));
    setTasks(prev => [...prev, taskToUncomplete]);
  };

  const handleDeleteTask = (taskToDelete: string) => {
     setCompletedTasks(prev => prev.filter(task => task !== taskToDelete));
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">To-Do List</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="text-base"
            />
            <Button type="submit" size="icon" disabled={!newTask.trim()}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add Task</span>
            </Button>
          </form>
          
          <ScrollArea className="h-48">
            {tasks.length > 0 ? (
              <ul className="space-y-2 pr-4">
                {tasks.map((task, index) => (
                  <li key={index} className="flex items-center group">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleCompleteTask(task)}>
                      <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </Button>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">You're all caught up!</p>
            )}
          </ScrollArea>

        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-40">
            {completedTasks.length > 0 ? (
              <ul className="space-y-2 pr-4">
                {completedTasks.map((task, index) => (
                  <li key={index} className="flex items-center text-muted-foreground group">
                     <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleUncompleteTask(task)}>
                       <CheckCircle2 className="w-5 h-5 text-primary" />
                     </Button>
                    <span className="line-through">{task}</span>
                    <Button variant="ghost" size="icon" className="ml-auto opacity-0 group-hover:opacity-100" onClick={() => handleDeleteTask(task)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No tasks completed yet.</p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
