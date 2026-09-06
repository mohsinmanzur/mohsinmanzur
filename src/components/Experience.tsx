import { dbService } from '@/lib/db/service';
import ExperienceTimeline from './ExperienceTimeline';

export default async function Experience() {
  const experiences = await dbService.getExperiences();
  return <ExperienceTimeline experiences={experiences} />;
}
