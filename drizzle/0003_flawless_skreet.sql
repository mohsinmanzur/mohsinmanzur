ALTER TABLE "projects" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "tagline" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "primary_link" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "secondary_link" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "secondary_logo_url" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "color" varchar(50);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "tech_stack" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "time_taken" varchar(100);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "summary" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;