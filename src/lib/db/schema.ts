import { pgTable, pgEnum, serial, text, varchar, timestamp, boolean, jsonb, date } from "drizzle-orm/pg-core";

export const experienceTypeEnum = pgEnum("experience_type", ["job", "project", "founder"]);

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  tagline: text("tagline").notNull(),
  primaryLink: text("primary_link"),
  secondaryLink: text("secondary_link"),
  logoUrl: text("logo_url"),
  secondaryLogoUrl: text("secondary_logo_url"),
  color: varchar("color", { length: 50 }),
  techStack: jsonb("tech_stack").$type<string[]>().default([]).notNull(),
  timeTaken: varchar("time_taken", { length: 100 }),
  summary: text("summary").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  icon: text("icon"),
  proficiency: serial("proficiency"),
  order: serial("order"),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  role: varchar("role", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  type: experienceTypeEnum("type").notNull(),
  location: varchar("location", { length: 255 }),
  startDate: date("start_date", { mode: "string" }).notNull(),
  // Null while the role is ongoing — paired with `current`.
  endDate: date("end_date", { mode: "string" }),
  current: boolean("current").default(false).notNull(),
  description: text("description").notNull(),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  // IDs into `projects`. Kept as a plain array column (not a join table) since
  // Projects is still empty — revisit as a many-to-many table once it has real rows.
  projectIds: jsonb("project_ids").$type<number[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
