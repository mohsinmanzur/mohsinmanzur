CREATE TYPE "public"."experience_type" AS ENUM('job', 'project', 'founder');--> statement-breakpoint
ALTER TABLE "experiences" ADD COLUMN "type" "experience_type" NOT NULL DEFAULT 'job';