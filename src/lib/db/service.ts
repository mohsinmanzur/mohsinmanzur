import { db } from "./client";
import { projects, skills, experiences } from "./schema";
import { eq } from "drizzle-orm";
import type {
  Project,
  Skill,
  NewSkill,
  Experience,
  NewExperience,
} from "./types";

export interface IDatabaseService {
  // Projects (table is currently id-only — populated later)
  getProjects(): Promise<Project[]>;
  createProject(): Promise<Project | null>;
  deleteProject(id: number): Promise<boolean>;

  // Skills
  getSkills(): Promise<Skill[]>;
  createSkill(data: NewSkill): Promise<Skill | null>;
  deleteSkill(id: number): Promise<boolean>;

  // Experiences
  getExperiences(): Promise<Experience[]>;
  createExperience(data: NewExperience): Promise<Experience | null>;
}

export class NeonPostgresDatabaseService implements IDatabaseService {
  async getProjects(): Promise<Project[]> {
    if (!db) return [];
    return await db.select().from(projects);
  }

  async createProject(): Promise<Project | null> {
    if (!db) return null;
    const result = await db.insert(projects).values({}).returning();
    return result[0] ?? null;
  }

  async deleteProject(id: number): Promise<boolean> {
    if (!db) return false;
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  async getSkills(): Promise<Skill[]> {
    if (!db) return [];
    return await db.select().from(skills).orderBy(skills.order);
  }

  async createSkill(data: NewSkill): Promise<Skill | null> {
    if (!db) return null;
    const result = await db.insert(skills).values(data).returning();
    return result[0] ?? null;
  }

  async deleteSkill(id: number): Promise<boolean> {
    if (!db) return false;
    const result = await db.delete(skills).where(eq(skills.id, id)).returning();
    return result.length > 0;
  }

  async getExperiences(): Promise<Experience[]> {
    if (!db) return [];
    return await db.select().from(experiences).orderBy(experiences.startDate);
  }

  async createExperience(data: NewExperience): Promise<Experience | null> {
    if (!db) return null;
    const result = await db.insert(experiences).values(data).returning();
    return result[0] ?? null;
  }
}

// Singleton instance exported across the application
export const dbService: IDatabaseService = new NeonPostgresDatabaseService();
