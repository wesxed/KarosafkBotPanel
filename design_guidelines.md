# Design Guidelines: Minecraft Bot Management Dashboard (Dark Theme)

## Design Approach
**Reference-Based Approach**: Discord's dark gaming interface + Linear's modern dashboard + Vercel's dashboard analytics aesthetic. Creates a technical, professional control panel optimized for extended viewing sessions with vibrant accent colors for data visualization and status indicators.

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts) - clean technical readability
- **Monospace Font**: JetBrains Mono - technical details, logs, metrics
- **Hierarchy**:
  - H1: 2rem (32px), font-weight 700
  - H2: 1.5rem (24px), font-weight 600
  - H3: 1.125rem (18px), font-weight 600
  - Body: 0.875rem (14px), font-weight 400
  - Small: 0.75rem (12px), font-weight 500
  - Metric Numbers: 2.5rem (40px), font-weight 700, monospace

### Layout System
**Spacing Scale**: Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Card padding: p-6
- Section spacing: gap-6 for grids
- Sidebar width: w-64 (fixed)
- Main content: px-8 py-6
- Form field spacing: space-y-4

### Component Library

#### Dashboard Layout Structure
- **Sidebar Navigation** (w-64, fixed, full-height):
  - Logo section (h-16, px-6, flex items-center)
  - Navigation menu (px-4, py-2, space-y-1)
  - Nav items: rounded-lg, px-4, py-3, text-sm font-medium, flex items-center gap-3
  - User profile section at bottom (px-4, py-4, border-t)

- **Main Content Area**:
  - Top bar (h-16, px-8, flex items-center justify-between, border-b)
  - Content wrapper (px-8 py-6, overflow-auto)
  - Page title (H1, mb-6)

#### Stat Cards Grid
- **Container**: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8
- **Card Structure**:
  - Rounded-xl, p-6
  - Icon container (w-12 h-12, rounded-lg, flex items-center justify-center, mb-4)
  - Label (text-sm, font-medium, mb-2)
  - Value (H1 size, font-weight 700, monospace)
  - Change indicator (text-xs, flex items-center gap-1, mt-2) - e.g., "↑ 12% bu hafta"

#### Weekly Activity Chart Section
- **Container**: Rounded-xl, p-6, mb-8
- **Header**: 
  - Title "Haftalık Aktivite" (H2, mb-1)
  - Subtitle "Son 7 günün özeti" (text-sm, mb-6)
- **Chart Area**: 
  - h-80 (320px height)
  - Use chart library placeholder: <!-- CHART LIBRARY: Recharts or Chart.js -->
  - Legend at top right (flex gap-6)
  - Legend items: dot indicator (w-3 h-3 rounded-full) + label (text-sm)
  - Two data series: "Kullanıcılar" (cyan accent) + "Mesajlar" (purple accent)

#### Recent Activities Feed
- **Container**: Rounded-xl, p-6
- **Header**: "Son Aktiviteler" (H2, mb-6)
- **Activity List**: space-y-4
- **Activity Item**:
  - Flex layout (gap-4, items-start, py-3, border-b last:border-0)
  - Avatar/Icon (w-10 h-10, rounded-full, flex-shrink-0)
  - Content area (flex-1):
    - Activity text (text-sm, font-medium)
    - Timestamp (text-xs, mt-1)
  - Status badge (text-xs, px-2 py-1, rounded-full)

#### Bot Management Components (Updated)
- **Bot Grid**: grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6
- **Bot Card**:
  - Rounded-xl, p-6
  - Header: Name (H3, monospace) + status badge (right-aligned)
  - Details grid (grid-cols-2 gap-x-4 gap-y-3 my-4, text-sm):
    - Labels in regular font
    - Values in monospace
  - Action bar (flex gap-2 mt-6):
    - Start button (flex-1, px-4 py-2, rounded-lg, font-medium)
    - Stop button (flex-1, px-4 py-2, rounded-lg, font-medium)
    - Settings icon button (p-2, rounded-lg)

#### Modal/Overlay Patterns
- **Backdrop**: Fixed, inset-0, backdrop-blur-sm
- **Modal Container**: max-w-lg, rounded-xl, p-8, mx-4
- **Form Structure**:
  - Title (H2, mb-6)
  - Field groups (space-y-4)
  - Input fields: rounded-lg, px-4 py-3, w-full, text-sm
  - Labels: text-sm, font-medium, mb-2
  - Helper text: text-xs, mt-1
  - Button group (flex gap-3 justify-end mt-8)

#### Status & Feedback Elements
- **Badges**: px-3 py-1, text-xs, font-semibold, rounded-full
- **Alerts/Warnings**: 
  - Rounded-lg, p-4, border-l-4, flex gap-3
  - Icon (w-5 h-5, flex-shrink-0)
  - Content area (flex-1, text-sm)
- **Toast Notifications**: 
  - Fixed bottom-right positioning
  - max-w-sm, rounded-lg, p-4, shadow-lg

### Icons
**Library**: Heroicons (CDN)
- Dashboard: chart-bar, users, server, cpu
- Actions: play, pause, trash, cog, plus-circle
- Status: check-circle, exclamation-triangle, clock
- Navigation: home, document-text, bell, user-circle

### Data Visualization
- **Chart Height**: h-80 (standard), h-64 (compact)
- **Grid Lines**: Subtle, minimal
- **Data Points**: Clear visual markers
- **Tooltips**: Rounded-lg, px-3 py-2, text-sm, shadow-lg
- **Legend**: Horizontal layout above chart, text-xs

### Responsive Breakpoints
- **Mobile (<768px)**: 
  - Sidebar collapses to overlay menu
  - Stat cards: single column
  - Charts: reduce height to h-64
  - Bot grid: single column
- **Tablet (768-1280px)**:
  - Stat cards: 2 columns
  - Bot grid: 2 columns
- **Desktop (>1280px)**:
  - Full layout with fixed sidebar
  - Stat cards: 4 columns
  - Bot grid: 3 columns

### Form Consistency
- Input height: h-12
- Border radius: rounded-lg
- Label spacing: mb-2
- Field spacing: space-y-4
- Focus treatment: ring-2 offset-2
- Disabled state: opacity-50, cursor-not-allowed

### Empty States
- Centered vertically and horizontally
- Icon (w-16 h-16, mb-4)
- Title (H3, mb-2)
- Description (text-sm, max-w-sm, mb-6)
- Primary action button

### Animations
**Minimal Usage**:
- Sidebar menu transitions (transform, duration-200)
- Chart entrance: fade-in only
- Modal: scale-95 to scale-100, opacity transition
- Hover states: No animations, visual indicators only

This design creates a professional, data-rich dashboard optimized for dark theme viewing with clear information hierarchy, efficient monitoring workflows, and gaming-focused aesthetics that appeal to technical users managing Minecraft bot operations.