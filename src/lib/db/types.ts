import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as schema from "./schema";

export type Profile = InferSelectModel<typeof schema.profiles>;
export type NewProfile = InferInsertModel<typeof schema.profiles>;

export type Project = InferSelectModel<typeof schema.projects>;
export type NewProject = InferInsertModel<typeof schema.projects>;

export type Skill = InferSelectModel<typeof schema.skills>;
export type NewSkill = InferInsertModel<typeof schema.skills>;

export type Experience = InferSelectModel<typeof schema.experiences>;
export type NewExperience = InferInsertModel<typeof schema.experiences>;

export type ContactMessage = InferSelectModel<typeof schema.contactMessages>;
export type NewContactMessage = InferInsertModel<typeof schema.contactMessages>;
