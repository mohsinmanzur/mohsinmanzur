import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import ScrollIndicator from '@/components/ScrollIndicator';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background pt-10 sm:pt-16 lg:pt-30">
      <ScrollIndicator />
      <div className="mb-20 sm:mb-32 lg:mb-40">
        <Hero />
      </div>
      <Experience />
      <Projects />
      <Footer />
    </main>
  );
}
