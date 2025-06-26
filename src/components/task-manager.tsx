"use client";

import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface TaskManagerProps {
  currentTask: string;
  setCurrentTask: Dispatch<SetStateAction<string>>;
  completedTasks: string[];
}

export function TaskManager({ currentTask, setCurrentTask, completedTasks }: TaskManagerProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Current Focus</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="What are you working on?"
            value={currentTask}
            onChange={(e) => setCurrentTask(e.target.value)}
            className="text-base"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          {completedTasks.length > 0 ? (
            <ul className="space-y-2 max-h-40 overflow-y-auto">
              {completedTasks.map((task, index) => (
                <li key={index} className="flex items-center text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                  <span className="line-through">{task}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No tasks completed yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
