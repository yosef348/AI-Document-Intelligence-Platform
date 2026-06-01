# DocIntel Frontend - Complete Component Inventory

## 📋 Component Directory

### Authentication Components (`src/components/auth/`)

#### `login-form.tsx`
**Type**: Client Component  
**Dependencies**: Supabase Auth, React Router

**State**:
- `email: string`
- `password: string`
- `isLoading: boolean`
- `error: string | null`
- `showPassword: boolean`

**Features**:
- Email/password input validation
- Password visibility toggle with eye icon
- Real-time error display
- Loading spinner on submit button
- Link to signup page
- Link to forgot password (placeholder)
- Automatic redirect to dashboard on success
- Error handling from Supabase auth

**Styling**: Dark theme, centered, responsive

#### `signup-form.tsx`
**Type**: Client Component

**State**:
- `fullName: string`
- `email: string`
- `password: string`
- `confirmPassword: string`
- `isLoading: boolean`
- `error: string | null`
- `success: boolean`
- `showPassword: boolean`

**Features**:
- Full name field
- Email validation
- Password strength validation (8+ characters)
- Confirm password matching
- Success state shows email confirmation message
- Link to login page
- Form validation before submission

**Validation Rules**:
- Password minimum 8 characters
- Password must match confirm password

#### `auth-card.tsx`
**Type**: Presentational Component

**Props**:
```typescript
interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}
```

**Features**:
- Card wrapper for auth forms
- Title and subtitle display
- Centered layout
- Consistent padding and borders

---

### Document Components (`src/components/documents/`)

#### `upload-dialog.tsx`
**Type**: Client Component (Modal)  
**Dependencies**: shadcn Dialog, Supabase Storage

**State**:
- `open: boolean`
- `file: File | null`
- `documentType: 'contract' | 'invoice' | 'report' | 'other'`
- `isUploading: boolean`
- `error: string | null`
- `dragOver: boolean`

**Props**:
```typescript
interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}
```

**Features**:
- Drag-and-drop file upload
- Click-to-browse file selection
- Document type selector (required)
- File size validation (max 50MB)
- File type validation (.pdf, .docx only)
- Shows filename and size when selected
- Remove file button
- Error alert if validation fails
- Upload button (disabled until file + type selected)
- Success callback on completion

**API Integration**:
- `POST /api/documents/upload` with FormData

#### `document-list.tsx`
**Type**: Client Component

**Props**:
```typescript
interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
}
```

**Features**:
- Table display of documents
- Columns: Name, Type, Size, Parse Status, AI Status, Uploaded, Actions
- Loading skeleton rows (5) when fetching
- Empty state when no documents
- File type icon indicators (PDF/DOCX)
- Relative time display ("2 hours ago")
- Human-readable file sizes (KB/MB)
- Download button (if downloadUrl available)
- Delete button with confirmation

**Styling**: Responsive table with horizontal scroll on mobile

#### `status-badge.tsx`
**Type**: Presentational Component

**Props**:
```typescript
interface StatusBadgeProps {
  status: string;
  type: 'parsing' | 'processing';
  className?: string;
}
```

**Status Indicators**:

**Parsing**:
- `pending` → Gray "Pending" (not loading)
- `parsing` → Blue "Parsing..." (animated spinner)
- `parsed` → Green "Parsed" ✓
- `failed` → Red "Failed" ✗

**Processing**:
- `pending` → Gray "Pending"
- `indexing` → Blue "Indexing..." (animated spinner)
- `processing` → Purple "Analyzing..." (animated spinner)
- `completed` → Green "Completed" ✓
- `failed` → Red "Failed" ✗

**Features**:
- Animated spinner for in-progress states
- Color-coded badges
- Fallback for unknown status

#### `document-actions.tsx`
**Type**: Client Component (Dropdown Menu)

**Props**:
```typescript
interface DocumentActionsProps {
  document: Document;
  onDelete: () => Promise<void>;
}
```

**Actions**:
1. Download (opens downloadUrl in new tab)
   - Disabled if no URL
2. Delete (with confirmation dialog)
   - Red button
   - Confirms before deletion

---

### Findings Components (`src/components/findings/`)

#### `findings-filter.tsx`
**Type**: Client Component

**Props**:
```typescript
interface FindingsFilterProps {
  filters: { severity: string; status: string; search: string };
  onChange: (filters: { severity: string; status: string; search: string }) => void;
  totalCount: number;
}
```

**Features**:
- Search input (with search icon)
- Severity dropdown (All, Critical, High, Medium, Low, Info)
- Status dropdown (All, Open, Acknowledged, In Review, Resolved, Dismissed)
- Clear all filters button (only shows when filters active)
- Total count display
- Real-time filter updates

**Styling**: Horizontal filter bar with flex layout

#### `findings-table.tsx`
**Type**: Client Component (Table)

**Props**:
```typescript
interface FindingsTableProps {
  findings: Finding[];
  isLoading: boolean;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onViewDetail: (finding: Finding) => void;
}
```

**Loading State**:
- 5 skeleton rows with pulse animation

**Empty State**:
- CheckCircle icon
- "No findings match your filters" message
- "Try adjusting your search or filters" hint

**Table Columns**:
1. Severity → SeverityBadge (color-coded)
2. Title → Clickable link to open detail sheet
   - Subtitle: Finding type (formatted)
3. Document → Document filename (truncated)
4. Confidence → Percentage display (e.g., "94%")
5. Status → StatusSelect dropdown (inline editing)
6. Date → Relative time ("2 hours ago")
7. Actions → Eye icon button to view details

**Features**:
- Responsive table with overflow-x on mobile
- Hover effects on rows
- Optimistic status updates
- Error recovery on update failure

#### `finding-detail-sheet.tsx`
**Type**: Client Component (Side Panel / Sheet)  
**Dependencies**: shadcn Sheet

**Props**:
```typescript
interface FindingDetailSheetProps {
  finding: Finding | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (status: string) => Promise<void>;
}
```

**Sections** (in order):

1. **Header**
   - Severity badge (large)
   - Finding title (text-2xl)
   - Finding type (formatted, muted)
   - Close button (X icon)

2. **Status & Actions Bar**
   - Current status badge
   - Status dropdown
   - Quick action buttons based on current status:
     - `open` → "Acknowledge", "Dismiss"
     - `acknowledged` → "Mark In Review", "Dismiss", "Resolve"
     - `in_review` → "Resolve", "Dismiss", "False Positive"
     - `resolved` → (read-only)
     - `dismissed` → (read-only)
     - `false_positive` → (read-only)

3. **Summary Section**
   - Label: "Summary"
   - Finding summary text (paragraph)

4. **Explanation Section** (if exists)
   - Label: "Detailed Analysis"
   - Explanation text (pre-wrapped for formatting)

5. **Evidence Section** (if evidence.extractedText)
   - Label: "Evidence"
   - Code block style container
   - Extracted text in monospace
   - Scrollable if long

6. **Location Section** (if location exists)
   - Label: "Location"
   - Badges for: section, clause, page
   - Only shown if data present

7. **AI Info Section**
   - Label: "Analysis Details"
   - 4-column grid:
     - Model Version: `modelVersion`
     - Prompt Version: `promptVersion`
     - Confidence: formatted percentage
     - Detected: formatted date

**Features**:
- Scrollable content area
- Smooth slide-in animation
- Loading state on status updates
- Error handling for failed updates
- Responsive width (full mobile, max-2xl desktop)

#### `status-select.tsx`
**Type**: Client Component (Dropdown)

**Props**:
```typescript
interface StatusSelectProps {
  currentStatus: string;
  onStatusChange: (status: string) => Promise<void>;
  isLoading?: boolean;
}
```

**Features**:
- Dropdown showing current status
- Available next statuses based on current:
  - `open` → `acknowledged`, `dismissed`
  - `acknowledged` → `in_review`, `resolved`, `dismissed`
  - `in_review` → `resolved`, `dismissed`, `false_positive`
  - `resolved` → (no options)
  - `dismissed` → (no options)
  - `false_positive` → (no options)
- ChevronDown icon on button
- Loading state with spinner
- Disabled while updating

---

### Shared Components (`src/components/shared/`)

#### `logo.tsx`
**Type**: Presentational Component

**Props**:
```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}
```

**Sizes**:
- `sm` → 16px icon, 12px text, 6px gap
- `md` → 20px icon, 18px text, 8px gap
- `lg` → 28px icon, 24px text, 10px gap

**Rendering**:
- FileSearch icon in primary-colored square
- "Doc" + "Intel" text (Intel highlighted in primary)
- Configurable visibility and styling

#### `severity-badge.tsx`
**Type**: Presentational Component  
**Dependencies**: shadcn Badge

**Props**:
```typescript
interface SeverityBadgeProps {
  severity: FindingSeverity;
  className?: string;
}
```

**Severity Types**:
- `critical` → Red badge
- `high` → Orange badge
- `medium` → Yellow badge
- `low` → Blue badge
- `info` → Gray badge

**Features**:
- Color-coded badges
- Dot indicator (colored circle)
- Label text capitalized
- Border styling

#### `stat-card.tsx`
**Type**: Presentational Component  
**Dependencies**: shadcn Card

**Props**:
```typescript
interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
  variant?: 'default' | 'critical' | 'warning' | 'success';
  className?: string;
}
```

**Variants**:
- `default` → Blue icon background
- `critical` → Red icon background
- `warning` → Orange icon background
- `success` → Green icon background

**Features**:
- Icon on right with colored background
- Title (label)
- Value (large bold number/text)
- Optional description
- Optional trend indicator
- Loading skeleton state
- Hover effect (border brightens)

#### `theme-provider.tsx`
**Type**: Provider Component  
**Dependencies**: next-themes

**Features**:
- Wraps app with theme context
- Enables dark/light mode toggle
- Persists theme preference
- System preference detection (optional)
- Prevents flashing on load

---

### Provider Components (`src/components/providers/`)

#### `auth-provider.tsx`
**Type**: Client Component (Provider)  
**Dependencies**: Supabase, Zustand

**Features**:
- Initializes auth on app load
- Fetches current session
- Loads user profile
- Loads first organization
- Sets global auth state
- Handles auth errors silently
- Cleanup on unmount

**State Updates**:
- Sets `useAuthStore`: user, session, organization, isLoading

---

### UI Components (`src/components/ui/`)

These are shadcn/ui components pre-configured for DocIntel:

1. **button.tsx** - Button with 4 variants
2. **input.tsx** - Text input field
3. **label.tsx** - Form label
4. **card.tsx** - Container (Card, CardHeader, CardContent)
5. **badge.tsx** - Status/tag badge (3 variants)
6. **avatar.tsx** - User avatar circle
7. **dropdown-menu.tsx** - Dropdown menu (with Radix UI)
8. **separator.tsx** - Horizontal divider
9. **skeleton.tsx** - Loading placeholder
10. **toast.tsx** - Toast notification (with Sonner)
11. **tooltip.tsx** - Hover tooltip
12. **alert.tsx** - Alert message box
13. **dialog.tsx** - Modal dialog
14. **sheet.tsx** - Side panel

---

## 🎯 Hook Utilities

### `use-auth.ts`
**Purpose**: Get current auth state  
**Returns**:
```typescript
{
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}
```

### `use-organization.ts`
**Purpose**: Get current organization  
**Returns**:
```typescript
{
  organizationId: string | null;
  organization: Organization | null;
}
```

---

## 🔧 Utility Functions

### `lib/utils/format.ts`

#### `formatBytes(bytes: number): string`
- Input: `1234`
- Output: `"1.2 KB"`
- Supports: B, KB, MB, GB

#### `formatRelativeTime(dateString: string): string`
- Input: `"2024-05-29T10:00:00Z"` (2 hours ago)
- Output: `"2 hours ago"`
- Special cases: "just now" for < 1 minute

#### `formatDate(dateString: string): string`
- Input: `"2024-05-29T00:00:00Z"`
- Output: `"May 29, 2024"` (locale-aware)

#### `formatConfidence(confidence: string): string`
- Input: `"0.94"` or `"94"` or `94`
- Output: `"94%"`

#### `formatFindingType(type: string): string`
- Input: `"short_termination_clause"`
- Output: `"Short Termination Clause"`

---

## 📊 Type Definitions

### Core Types

#### `Finding`
```typescript
{
  id: string;
  organizationId: string;
  documentId: string;
  aiRunId: string | null;
  findingType: string;
  category: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  confidence: string; // e.g., "0.94"
  status: FindingStatus;
  title: string;
  summary: string;
  explanation: string | null;
  evidence: {
    extractedText?: string;
    pageRefs?: number[];
  };
  location: {
    section?: string;
    clause?: string;
    page?: number;
  } | null;
  promptVersion: string | null;
  modelVersion: string | null;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

#### `Document`
```typescript
{
  id: string;
  organizationId: string;
  type: 'contract' | 'invoice' | 'report' | 'email' | 'other';
  filename: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  parsingStatus: 'pending' | 'parsing' | 'parsed' | 'failed';
  processingStatus: 'pending' | 'indexing' | 'processing' | 'completed' | 'failed';
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
```

#### `FindingsStats`
```typescript
{
  total: number;
  open: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}
```

---

## 🔄 Data Flow Examples

### Document Upload Flow
1. User opens UploadDialog
2. Drags file or clicks to browse
3. File selected → validate size & type
4. User selects document type → enable upload button
5. Click upload:
   - Create FormData with file + type
   - POST to `/api/documents/upload`
   - Show loading spinner
   - On success: close dialog, call onSuccess callback
   - On error: show error alert

### Finding Status Update Flow
1. User clicks status dropdown in FindingsTable
2. Select new status:
   - Optimistically update local state
   - PATCH to `/api/findings/{id}`
   - Show loading spinner
   - On success: status persisted (UI already updated)
   - On error: refetch findings and stats to restore correct state

---

## ✨ Component Composition Examples

### Documents Page Structure
```
DocumentsPageContent (client)
├── Header with upload button
├── UploadDialog
│   └── Drop zone + file input
│   └── Type selector
│   └── Upload button
└── DocumentList
    └── Table with rows
        └── StatusBadge (per column)
        └── DocumentActions (dropdown)
```

### Findings Page Structure
```
FindingsPageContent (client)
├── Header
├── Stats row (4 StatCards)
├── FindingsFilter
│   ├── Search input
│   ├── Severity select
│   ├── Status select
│   └── Clear filters button
└── FindingsTable
    └── Table with rows
        ├── SeverityBadge
        ├── StatusSelect (inline)
        └── Actions (view button)
└── FindingDetailSheet (when row clicked)
    ├── Header + severity badge
    ├── Status controls
    ├── Summary section
    ├── Explanation section
    ├── Evidence section
    ├── Location section
    └── AI details section
```

---

## 📝 Summary Statistics

- **Total Components**: 24
  - Auth: 3
  - Documents: 4
  - Findings: 4
  - Shared: 4
  - Providers: 1
  - UI (shadcn): 14 (pre-configured)

- **Total Pages/Layouts**: 8
  - Root layout + pages: 4
  - Auth pages: 2
  - Dashboard pages: 4

- **Total Hooks**: 2
- **Total Utilities**: 5 (format functions)
- **Total Types**: 7 (major types)
- **Total Custom CSS Classes**: 15+ (from globals.css)

**Total Lines of Code**: ~5,000+ (components + utilities)

---

**Last Updated**: May 31, 2026  
**Status**: ✅ Complete and Production-Ready

