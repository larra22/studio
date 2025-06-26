import { Flower2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
       <header className="flex items-center justify-center text-center mb-12">
        <Flower2 className="w-12 h-12 text-primary" />
        <h1 className="text-5xl font-bold ml-4 font-headline text-primary-foreground">
          Tomato Time
        </h1>
      </header>
      <Card className="w-full max-w-sm bg-card/90 backdrop-blur-sm border-border/50 shadow-lg shadow-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">Join us and start focusing in style!</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="cutie@pie.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full mt-2">
              <UserPlus className="mr-2" />
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary-foreground/80 hover:text-primary-foreground">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
