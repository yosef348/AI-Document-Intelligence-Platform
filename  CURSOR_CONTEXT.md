# AI Document Intelligence Platform — Cursor Context

## What we are building
An MVP AI SaaS that analyzes business documents (contracts and invoices),
detects risks and anomalies using AI, and displays findings on a dashboard.

## MVP scope only — nothing outside this list
- Authentication (Supabase Auth)
- Organization onboarding
- Document upload (PDF, DOCX)
- PDF/DOCX parsing
- Text chunking (512 tokens, 50 overlap)
- Embedding generation (OpenAI)
- AI document analysis (LangGraph)
- Findings dashboard

## Do NOT build
- Notifications (Slack, email, webhook)
- Workflow engine
- Evaluation system
- Feature flags
- Audit logs
- Usage metrics
- Data retention policies
- Webhooks
- API keys
- Jobs table
- Enterprise compliance features

---

## Tech stack

### Backend
- NestJS (TypeScript, strict mode)
- Drizzle ORM (PostgreSQL queries)
- Supabase PostgreSQL (existing schema)
- Supabase Auth (JWT verification)
- Supabase Storage (file uploads)
- OpenAI API (embeddings + analysis)
- LangGraph (AI agent orchestration)
- class-validator (DTO validation)
- @nestjs/config (typed configuration)

### Frontend
- Next.js 15 (App Router)
- TypeScript (strict mode)
- TailwindCSS
- shadcn/ui
- Supabase client (@supabase/ssr)
- Zustand (auth/org state)

### Infrastructure
- Supabase PostgreSQL + pgvector
- Supabase Auth
- Supabase Storage
- GitHub + CodeRabbit

---

## Project structure
ai-document-intelligence-agent/
├── .env                        ← all secrets live here
├── .env.example
├── .gitignore
├── package.json                ← npm workspaces root
├── CURSOR_CONTEXT.md
│
├── backend/                    ← NestJS
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── drizzle.config.ts
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── config/
│       │   └── configuration.ts
│       ├── database/
│       │   ├── database.module.ts
│       │   ├── database.service.ts
│       │   └── schema/
│       │       ├── index.ts
│       │       ├── organizations.ts
│       │       ├── profiles.ts
│       │       ├── memberships.ts
│       │       ├── documents.ts
│       │       ├── chunks.ts
│       │       ├── embeddings.ts
│       │       ├── ai-runs.ts
│       │       └── findings.ts
│       ├── common/
│       │   ├── guards/
│       │   │   └── supabase-auth.guard.ts
│       │   ├── filters/
│       │   │   └── http-exception.filter.ts
│       │   ├── interceptors/
│       │   │   └── logging.interceptor.ts
│       │   └── decorators/
│       │       ├── current-user.decorator.ts
│       │       └── organization-id.decorator.ts
│       └── modules/
│           ├── auth/
│           │   ├── auth.module.ts
│           │   ├── auth.controller.ts
│           │   └── auth.service.ts
│           ├── organizations/
│           │   ├── organizations.module.ts
│           │   ├── organizations.controller.ts
│           │   ├── organizations.service.ts
│           │   └── dto/
│           │       ├── create-organization.dto.ts
│           │       └── update-organization.dto.ts
│           ├── documents/
│           │   ├── documents.module.ts
│           │   ├── documents.controller.ts
│           │   ├── documents.service.ts
│           │   └── dto/
│           │       └── upload-document.dto.ts
│           ├── ingestion/
│           │   ├── ingestion.module.ts
│           │   └── ingestion.service.ts
│           ├── embeddings/
│           │   ├── embeddings.module.ts
│           │   └── embeddings.service.ts
│           ├── agent/
│           │   ├── agent.module.ts
│           │   ├── agent.service.ts
│           │   └── graph/
│           │       ├── state.ts
│           │       ├── graph.ts
│           │       └── nodes/
│           │           ├── retrieve.ts
│           │           ├── reason.ts
│           │           ├── classify.ts
│           │           └── act.ts
│           └── findings/
│               ├── findings.module.ts
│               ├── findings.controller.ts
│               ├── findings.service.ts
│               └── dto/
│                   └── update-finding.dto.ts
│
└── frontend/                   ← Next.js 15
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── documents/page.tsx
│       └── findings/page.tsx
├── components/
│   ├── ui/
│   ├── auth/
│   │   └── login-form.tsx
│   ├── documents/
│   │   ├── upload-zone.tsx
│   │   └── document-list.tsx
│   └── findings/
│       ├── findings-table.tsx
│       └── finding-card.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── api/
│       └── client.ts
├── hooks/
│   ├── use-auth.ts
│   └── use-organization.ts
└── types/
└── index.ts

---

## Database

Existing Supabase PostgreSQL schema. Tables already created.
Drizzle ORM is used in the backend for type-safe queries.
Do NOT run migrations — schema already exists in Supabase.

### MVP tables (only these matter for MVP)
- organizations — root tenant
- profiles — linked to auth.users
- memberships — user ↔ org with role
- documents — uploaded files, soft-deleted
- chunks — parsed text, 512 tokens
- embeddings — pgvector vectors, separated from chunks
- ai_runs — LangGraph execution tracking
- findings — AI-detected risks, core output

### Drizzle schema files location
backend/src/database/schema/
Each table has a corresponding .ts file already created.
Import from: import { tableName } from '../database/schema'

---

## Architecture rules — follow exactly

### Backend rules
1. No any types — ever
2. Explicit return types on all functions
3. All DB queries scoped to organizationId
4. Never return storage_path to client — signed URLs only
5. All errors go through HttpExceptionFilter
6. ConfigService<Config, true> with { infer: true } pattern
7. Supabase client in guard: persistSession: false, autoRefreshToken: false
8. DatabaseService.db is the Drizzle instance — inject DatabaseService
9. Every module: module.ts, service.ts, controller.ts, dto/ folder
10. All protected routes use @UseGuards(SupabaseAuthGuard)

### Frontend rules
1. No any types — ever
2. Supabase client from lib/supabase/client.ts (browser)
3. Supabase server client from lib/supabase/server.ts (server)
4. NestJS API calls go through lib/api/client.ts
5. Auth state managed via Zustand store
6. Never call NestJS API directly — always through api/client.ts
7. x-organization-id header on every API call

### Database query pattern (Drizzle)
```typescript
// Always scope to organizationId
const result = await this.db.db
  .select()
  .from(documents)
  .where(
    and(
      eq(documents.organizationId, organizationId),
      isNull(documents.deletedAt)
    )
  );
```

### DTO pattern
```typescript
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSomethingDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUUID()
  organizationId!: string;
}
```

### Controller pattern
```typescript
@Controller('resource')
@UseGuards(SupabaseAuthGuard)
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

  @Get()
  async list(
    @CurrentUser() user: User,
    @OrganizationId() organizationId: string,
  ): Promise<ResourceResponse[]> {
    return this.service.list(organizationId);
  }
}
```

---

## Environment variables

### Backend (.env at root)
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=sk-...
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=...

### Frontend (.env at root)
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_API_URL=http://localhost:3001

---

## API response conventions

### Success
```typescript
// Single item
return { data: item };

// List
return { data: items, count: items.length };
```

### Error (handled by HttpExceptionFilter)
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "path": "/api/documents"
}
```

---

## Implementation status

### Completed
- [x] NestJS initialized
- [x] Next.js initialized
- [x] npm workspaces configured
- [x] Drizzle ORM configured
- [x] Database schema files created
- [x] DatabaseModule + DatabaseService
- [x] configuration.ts with env validation

### In progress
- [x] Auth module

### Not started
- [ ] Organizations module
- [ ] Documents module
- [ ] Ingestion service
- [ ] Embeddings service
- [ ] Agent module (LangGraph)
- [ ] Findings module
- [ ] Frontend auth pages
- [ ] Frontend dashboard
- [ ] Frontend documents page
- [ ] Frontend findings page