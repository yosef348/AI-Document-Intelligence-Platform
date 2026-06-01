# DocIntel Frontend - Developer Quickstart Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Supabase project created and configured

### 1. Environment Setup

Create `.env.local` in the `frontend/` directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Get these values from:
- **Supabase URL**: Project Settings → API → Project URL
- **Anon Key**: Project Settings → API → Project API keys (anon public)
- **API URL**: Your backend server URL (default: http://localhost:3001)

### 2. Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- ✅ Next.js 16.2.6 with Turbopack
- ✅ React 19 with latest features
- ✅ TypeScript with strict mode
- ✅ Tailwind CSS 4 with PostCSS
- ✅ shadcn/ui components (13 pre-configured)
- ✅ Supabase SDKs (SSR + Auth)
- ✅ Zustand for state management
- ✅ Lucide React icons
- ✅ Sonner for toast notifications

### 3. Run Development Server

```bash
npm run dev
```

Server starts on: **http://localhost:3000**

### 4. Run Production Build

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth routes (public)
│   │   │   ├── layout.tsx            # Auth layout with branding
│   │   │   ├── login/page.tsx        # Login page
│   │   │   └── signup/page.tsx       # Signup page
│   │   ├── (dashboard)/              # Protected routes
│   │   │   ├── documents/            # Documents page
│   │   │   ├── findings/             # Findings dashboard
│   │   │   ├── page.tsx              # Dashboard root
│   │   │   ├── error.tsx             # Error boundary
│   │   │   └── loading.tsx           # Loading skeleton
│   │   ├── layout.tsx                # Root layout (providers)
│   │   ├── page.tsx                  # Root page (redirects)
│   │   ├── not-found.tsx             # 404 page
│   │   └── globals.css               # Global styles + CSS vars
│   ├── components/
│   │   ├── auth/                     # Auth components
│   │   │   ├── login-form.tsx
│   │   │   ├── signup-form.tsx
│   │   │   └── auth-card.tsx
│   │   ├── documents/                # Documents page components
│   │   │   ├── upload-dialog.tsx
│   │   │   ├── document-list.tsx
│   │   │   ├── document-actions.tsx
│   │   │   └── status-badge.tsx
│   │   ├── findings/                 # Findings dashboard components
│   │   │   ├── findings-table.tsx
│   │   │   ├── findings-filter.tsx
│   │   │   ├── finding-detail-sheet.tsx
│   │   │   └── status-select.tsx
│   │   ├── shared/                   # Reusable components
│   │   │   ├── logo.tsx
│   │   │   ├── severity-badge.tsx
│   │   │   ├── stat-card.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── providers/
│   │   │   └── auth-provider.tsx     # Auth context setup
│   │   └── ui/                       # shadcn components (auto-generated)
│   ├── hooks/
│   │   ├── use-auth.ts               # Auth hook
│   │   └── use-organization.ts       # Organization hook
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts             # API request client
│   │   ├── supabase/
│   │   │   ├── client.ts             # Client-side Supabase
│   │   │   └── server.ts             # Server-side Supabase
│   │   ├── utils/
│   │   │   └── format.ts             # Formatting utilities
│   │   └── utils.ts                  # General utilities (cn, etc)
│   ├── store/
│   │   └── auth.store.ts             # Zustand auth store
│   ├── types/
│   │   └── index.ts                  # TypeScript type definitions
│   └── middleware.ts                 # Next.js middleware (auth)
├── public/                           # Static assets
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
└── package.json                      # Dependencies
```

## 🎨 Design System

### Colors (Dark Mode by Default)

- **Primary**: Electric Blue (`#3b82f6`)
- **Background**: Dark Navy (`#0f172a`)
- **Card**: Slightly Lighter Navy (`#1e293b`)
- **Text**: Off-white (`#e0e7ff`)
- **Muted**: Gray (`#64748b`)

CSS variables defined in `src/app/globals.css`:

```css
:root {
  --primary: 217 91% 60%;
  --background: 222 47% 6%;
  --card: 222 47% 9%;
  --brand-blue: 217 91% 60%;
  /* ... 40+ variables ... */
}

.dark { /* Applied by default */ }
```

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Sizes**: 
  - H1: 2rem (32px)
  - H2: 1.5rem (24px)
  - Body: 0.875rem (14px)
  - Caption: 0.75rem (12px)

### Components

All from shadcn/ui (installed):
- Button (4 variants: default, secondary, outline, ghost)
- Input (text field with validation)
- Label (form labels)
- Card (container)
- Badge (status/tag)
- Dialog (modals)
- Sheet (side panels)
- Select (dropdowns)
- Alert (messages)
- Skeleton (loading)
- Toast (notifications via Sonner)
- Avatar (user profiles)
- Tooltip (hover info)

## 🔐 Authentication Flow

### Login
1. User enters email/password
2. Supabase `signInWithPassword()`
3. Session stored in cookies (via SSR)
4. Redirect to `/dashboard`

### Signup
1. User enters full name, email, password
2. Password validation (8+ chars, match confirm)
3. Supabase `signUp()`
4. Show email confirmation message
5. User confirms email in inbox
6. Can then login

### Session Management
- Middleware checks session on every request
- Protected routes redirect unauthenticated to `/login`
- Auth routes redirect authenticated to `/dashboard`
- Automatic logout on session expiration

## 📊 Key Pages

### `/login`
- Email/password form
- Forgot password link (placeholder)
- Sign up link
- Validation errors displayed
- Loading state on submit

### `/signup`
- Full name input
- Email/password with confirmation
- Password strength validation
- Email confirmation success state
- Login link

### `/documents`
- Upload dialog (drag-drop + click)
- Document list table with:
  - Filename
  - Document type badge
  - Size in MB
  - Parsing status (pending → parsed → failed)
  - AI processing status
  - Upload time (relative)
  - Download/delete buttons
- Auto-polling for status updates (5s interval)
- Empty state when no documents

### `/findings`
- 4 stat cards: Critical, High, Medium, Open
- Advanced filter bar:
  - Search by title
  - Filter by severity
  - Filter by status
  - Clear filters button
- Findings table with:
  - Severity badge (color-coded)
  - Finding title (clickable)
  - Document name
  - Confidence %
  - Status (editable)
  - Created date (relative)
  - View details button
- Detail sheet (side panel):
  - Full finding info
  - Evidence/extracted text
  - Location (section/clause)
  - AI model/prompt versions
  - Status update buttons

## 🔄 State Management

### Global State (Zustand)

```typescript
// auth.store.ts
- user: User | null
- session: Session | null
- organization: Organization | null
- isLoading: boolean
```

Access with:
```typescript
import { useAuthStore } from '@/store/auth.store';

const { user, session, organization } = useAuthStore();
```

### Local State

Each page manages its own state:
- Documents page: `documents[]`, `isLoading`, `uploadDialogOpen`
- Findings page: `findings[]`, `stats`, `filters`, `selectedFinding`

### Hooks

```typescript
// Authentication
const { session, user } = useAuth();

// Organization context
const { organizationId } = useOrganization();
```

## 🔌 API Integration

### API Client

Located in `src/lib/api/client.ts`:

```typescript
export const api = {
  auth: { me: (token) => {...} },
  organizations: { list, create, getById },
  documents: { list, getById, upload, delete },
  findings: { list, stats, getById, updateStatus },
};
```

Usage:
```typescript
const documents = await api.documents.list(token, organizationId);
const stats = await api.findings.stats(token, organizationId);
```

### Response Handling

- All responses typed
- Errors thrown as `ApiError` with statusCode
- Automatic JSON parsing
- FormData support for uploads

## 🎯 Common Tasks

### Add a New Page

1. Create `src/app/(dashboard)/[page]/page.tsx`
2. Add server component wrapper
3. Create `src/app/(dashboard)/[page]/content.tsx` for client logic
4. Create components in `src/components/[module]/`

### Add a Component

1. Create in appropriate folder: `src/components/[module]/component.tsx`
2. Export as `export function ComponentName(): React.JSX.Element`
3. Import and use with full type safety

### Style Components

- Use Tailwind classes only
- Reference CSS variables for colors: `bg-primary`, `text-foreground`
- Use `cn()` utility for conditional classes:
  ```typescript
  import { cn } from '@/lib/utils';
  
  <div className={cn('base-class', condition && 'conditional-class')}>
  ```

### Handle Async Operations

```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

try {
  setIsLoading(true);
  setError(null);
  
  const data = await api.something();
  
  // Success
} catch (err) {
  setError(err instanceof Error ? err.message : 'Unknown error');
} finally {
  setIsLoading(false);
}
```

## 🧪 Development Tips

### Type Safety
- Always use explicit types
- No `any` types
- Leverage TypeScript for catching errors early
- Use `@/types` for data structures

### Performance
- Use `React.memo()` for expensive components
- Leverage `useCallback()` to prevent unnecessary renders
- Code-split with dynamic imports for large features

### Debugging
- Check browser console for errors
- Use React DevTools for component inspection
- Network tab to verify API calls
- Lighthouse for performance audits

### Testing
- Components work in both light/dark modes
- Forms validate correctly
- Loading states appear during async operations
- Empty states shown when no data
- Error messages displayed on failures

## 📱 Responsive Design

All components are mobile-first:
- `sm:` - 640px (tablets)
- `md:` - 768px (small desktops)
- `lg:` - 1024px (desktops)
- `xl:` - 1280px (large desktops)

Example:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

## 🚨 Troubleshooting

### Build Errors

**"Cannot find module"**
- Run `npm install` again
- Check import paths (should use `@/`)
- Verify file exists

**"Type error: JSX.Element not found"**
- Use `React.JSX.Element` instead of `JSX.Element`
- All component return types must be explicit

### Runtime Errors

**"Supabase credentials not found"**
- Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart dev server after adding env vars

**"API requests failing"**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend server is running
- Verify authentication token is being sent

**"Styling not applied"**
- Ensure Tailwind classes are spelled correctly
- Check dark mode is active: `<html className="dark">`
- Verify CSS variables are defined in globals.css

## 📚 Further Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## ✅ Verification Checklist

Before deploying:

- [ ] All environment variables set in `.env.local`
- [ ] `npm run build` completes without errors
- [ ] No TypeScript errors: `tsc --noEmit`
- [ ] Dev server starts: `npm run dev`
- [ ] Can login with test credentials
- [ ] Can upload documents
- [ ] Can view findings with filters
- [ ] Dark mode works
- [ ] Mobile view responsive
- [ ] No console errors

## 🎓 Architecture Patterns

### Server Components (default)
- Fetch data server-side
- No interactivity
- Cannot use hooks
- Use `async/await` directly

```typescript
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### Client Components
- Use `'use client'` directive
- Can use hooks (useState, useEffect)
- Interactivity & real-time updates
- Serializable props only

```typescript
'use client';
export default function Component() {
  const [state, setState] = useState();
  return <div>{state}</div>;
}
```

### Mixed Pattern (Used Here)
```typescript
// Page (server component)
export default function DocumentsPage() {
  return <DocumentsPageContent />;
}

// Content (client component with all logic)
'use client'
export default function DocumentsPageContent() { ... }
```

---

**Last Updated**: May 31, 2026  
**Status**: ✅ Production Ready  
**Maintainer**: Development Team

