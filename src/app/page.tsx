import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import ScrollIndicator from '@/components/ScrollIndicator';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background py-10 sm:py-16 lg:py-30">
      <ScrollIndicator />
      <div className="mb-20 sm:mb-32 lg:mb-40">
        <Hero />
      </div>
      <Experience />
      <Skills />
    </main>
  );
}
