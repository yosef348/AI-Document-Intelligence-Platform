CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"plan" text DEFAULT 'starter' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"stripe_customer_id" text,
	"billing_email" text,
	"trial_ends_at" timestamp with time zone,
	"sso_enabled" boolean DEFAULT false NOT NULL,
	"sso_provider" text,
	"allowed_email_domains" text[] DEFAULT '{}' NOT NULL,
	"max_members" integer DEFAULT 10 NOT NULL,
	"max_documents" integer DEFAULT 500 NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug"),
	CONSTRAINT "organizations_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text DEFAULT 'analyst' NOT NULL,
	"invited_by" uuid,
	"invite_token" text,
	"invite_expires_at" timestamp with time zone,
	"joined_at" timestamp with time zone,
	"created_by" uuid,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "memberships_invite_token_unique" UNIQUE("invite_token")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"deleted_by" uuid,
	"type" text NOT NULL,
	"filename" text NOT NULL,
	"original_filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" bigint NOT NULL,
	"page_count" integer,
	"storage_provider" text DEFAULT 'supabase' NOT NULL,
	"storage_bucket" text DEFAULT 'documents' NOT NULL,
	"storage_path" text NOT NULL,
	"storage_version" text,
	"checksum" text NOT NULL,
	"checksum_algorithm" text DEFAULT 'sha256' NOT NULL,
	"parsing_status" text DEFAULT 'pending' NOT NULL,
	"processing_status" text DEFAULT 'pending' NOT NULL,
	"extracted_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"idempotency_key" text,
	"deleted_at" timestamp with time zone,
	"archived_at" timestamp with time zone,
	"retention_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"chunk_index" integer NOT NULL,
	"page_number" integer,
	"section_title" text,
	"chunk_text" text NOT NULL,
	"token_count" integer NOT NULL,
	"chunk_strategy" text DEFAULT 'fixed_512_overlap_50' NOT NULL,
	"overlap_tokens" integer DEFAULT 50 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"chunk_id" uuid NOT NULL,
	"model" text NOT NULL,
	"model_version" text DEFAULT 'latest' NOT NULL,
	"provider" text DEFAULT 'openai' NOT NULL,
	"dimensions" integer DEFAULT 1536 NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"embedding_latency_ms" integer,
	"token_count" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"document_id" uuid,
	"triggered_by" uuid,
	"model_name" text NOT NULL,
	"model_provider" text DEFAULT 'openai' NOT NULL,
	"prompt_version" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"token_input" integer,
	"token_output" integer,
	"token_cached" integer,
	"cost_total" numeric(12, 6),
	"cost_currency" text DEFAULT 'USD' NOT NULL,
	"latency_ms" integer,
	"trace_id" text,
	"graph_state" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"current_node" text,
	"raw_output" jsonb,
	"error" text,
	"attempt_number" integer DEFAULT 1 NOT NULL,
	"max_attempts" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"ai_run_id" uuid,
	"finding_type" text NOT NULL,
	"category" text,
	"severity" text NOT NULL,
	"confidence" numeric(4, 3) NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"explanation" text,
	"evidence" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"location" jsonb,
	"prompt_version" text,
	"model_version" text,
	"model_provider" text,
	"created_by" uuid,
	"acknowledged_by" uuid,
	"resolved_by" uuid,
	"deleted_by" uuid,
	"acknowledged_at" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "findings_confidence_range_check" CHECK (confidence >= 0 AND confidence <= 1)
);
--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chunks" ADD CONSTRAINT "chunks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_chunk_id_chunks_id_fk" FOREIGN KEY ("chunk_id") REFERENCES "public"."chunks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_runs" ADD CONSTRAINT "ai_runs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_runs" ADD CONSTRAINT "ai_runs_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "findings" ADD CONSTRAINT "findings_ai_run_id_ai_runs_id_fk" FOREIGN KEY ("ai_run_id") REFERENCES "public"."ai_runs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "memberships_user_org_unique" ON "memberships" USING btree ("user_id","organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "documents_idempotency_key_unique" ON "documents" USING btree ("idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "chunks_document_id_chunk_index_unique" ON "chunks" USING btree ("document_id","chunk_index");--> statement-breakpoint
CREATE UNIQUE INDEX "embeddings_chunk_model_unique" ON "embeddings" USING btree ("chunk_id","model","model_version");