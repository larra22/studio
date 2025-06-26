import { Flower2 } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-center text-center">
      <Flower2 className="w-12 h-12 text-primary" />
      <h1 className="text-5xl font-bold ml-4 font-headline text-primary-foreground">
        Tomato Time
      </h1>
    </header>
  );
}
