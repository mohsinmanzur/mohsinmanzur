import { db } from "./client";
import { profiles, projects, skills, experiences, contactMessages } from "./schema";
import { eq, desc } from "drizzle-orm";
import type {
  Profile,
  NewProfile,
  Project,
  NewProject,
  Skill,
  NewSkill,
  Experience,
  NewExperience,
  ContactMessage,
  NewContactMessage,
} from "./types";

export interface IDatabaseService {
  // Profiles
  getProfile(): Promise<Profile | null>;
  upsertProfile(data: NewProfile): Promise<Profile | null>;

  // Projects
  getProjects(options?: { featuredOnly?: boolean }): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | null>;
  createProject(data: NewProject): Promise<Project | null>;
  updateProject(id: number, data: Partial<NewProject>): Promise<Project | null>;
  deleteProject(id: number): Promise<boolean>;

  // Skills
  getSkills(): Promise<Skill[]>;
  createSkill(data: NewSkill): Promise<Skill | null>;
  deleteSkill(id: number): Promise<boolean>;

  // Experiences
  getExperiences(): Promise<Experience[]>;
  createExperience(data: NewExperience): Promise<Experience | null>;

  // Contact Messages
  createContactMessage(data: NewContactMessage): Promise<ContactMessage | null>;
  getContactMessages(): Promise<ContactMessage[]>;
}

export class NeonPostgresDatabaseService implements IDatabaseService {
  async getProfile(): Promise<Profile | null> {
    if (!db) return null;
    const result = await db.select().from(profiles).limit(1);
    return result[0] ?? null;
  }

  async upsertProfile(data: NewProfile): Promise<Profile | null> {
    if (!db) return null;
    const existing = await this.getProfile();
    if (existing) {
      const updated = await db
        .update(profiles)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(profiles.id, existing.id))
        .returning();
      return updated[0] ?? null;
    } else {
      const created = await db.insert(profiles).values(data).returning();
      return created[0] ?? null;
    }
  }

  async getProjects(options?: { featuredOnly?: boolean }): Promise<Project[]> {
    if (!db) return [];
    let query = db.select().from(projects);
    if (options?.featuredOnly) {
      query = query.where(eq(projects.featured, true)) as typeof query;
    }
    return await query.orderBy(desc(projects.createdAt));
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    if (!db) return null;
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);
    return result[0] ?? null;
  }

  async createProject(data: NewProject): Promise<Project | null> {
    if (!db) return null;
    const result = await db.insert(projects).values(data).returning();
    return result[0] ?? null;
  }

  async updateProject(id: number, data: Partial<NewProject>): Promise<Project | null> {
    if (!db) return null;
    const result = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
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
    return await db.select().from(experiences);
  }

  async createExperience(data: NewExperience): Promise<Experience | null> {
    if (!db) return null;
    const result = await db.insert(experiences).values(data).returning();
    return result[0] ?? null;
  }

  async createContactMessage(data: NewContactMessage): Promise<ContactMessage | null> {
    if (!db) return null;
    const result = await db.insert(contactMessages).values(data).returning();
    return result[0] ?? null;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    if (!db) return [];
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
}

// Singleton instance exported across the application
export const dbService: IDatabaseService = new NeonPostgresDatabaseService();
