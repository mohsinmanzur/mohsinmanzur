import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import ScrollIndicator from '@/components/ScrollIndicator';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col gap-40 bg-background py-10 sm:py-16 lg:py-30">
      <ScrollIndicator />
      <Hero />
      <Experience />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}
