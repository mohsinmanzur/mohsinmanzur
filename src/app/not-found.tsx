import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-center">
      <span className="font-mono text-sm font-semibold tracking-widest text-primary">
        ERROR
      </span>

      <h1 className="relative mt-2 text-7xl font-bold tracking-tight text-text sm:text-8xl lg:text-9xl">
        4
        <span className="relative inline-block text-primary">
          0
          <span
            className="absolute bottom-2 left-0 -z-10 h-3 w-full rounded-sm opacity-20 sm:h-4"
            style={{ backgroundColor: 'var(--primary)' }}
          />
        </span>
        4
      </h1>

      <p className="mt-6 max-w-md text-lg text-text-grey sm:text-xl">
        This page doesn&apos;t exist, or it moved somewhere I forgot to link.
      </p>

      <div className="mt-8">
        <Button render={<a href="/" />}>
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Button>
      </div>
    </main>
  );
}
