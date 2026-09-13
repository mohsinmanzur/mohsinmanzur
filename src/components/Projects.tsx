import { dbService } from '@/lib/db/service';
import type { Project } from '@/lib/db/types';
import AppleProjectsCarousel from './AppleProjectsCarousel';

export default async function Projects() {
  const allProjects: Project[] = await dbService.getProjects();
  const activeProjects = allProjects.filter((p) => p.isActive);

  return (
    <section
      id="projects"
      className="flex w-full flex-col justify-center gap-6 mb-20 sm:mb-32 overflow-hidden"
    >
      <div className="mx-auto max-w-3xl px-6 text-center pb-10">
        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">Projects</h2>
        <p className="mt-3 text-base text-text-grey sm:text-lg">
          Production systems, mobile applications, and platforms I&apos;ve engineered.
        </p>
      </div>

      <AppleProjectsCarousel projects={activeProjects} />
    </section>
  );
}
