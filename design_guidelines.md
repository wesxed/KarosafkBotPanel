# Design Guidelines: Minecraft Bot Management Platform

## Design Approach
**Reference-Based Approach**: Drawing inspiration from Discord's gaming-focused interface combined with Linear's modern dashboard aesthetics. This creates a technical yet approachable platform that resonates with the gaming community while maintaining professional control panel functionality.

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts) - clean, technical readability
- **Monospace Font**: JetBrains Mono - for technical details (IP addresses, ports, bot names)
- **Hierarchy**:
  - H1: 2.5rem (40px), font-weight 700 - page titles
  - H2: 1.875rem (30px), font-weight 600 - section headers
  - H3: 1.25rem (20px), font-weight 600 - card titles
  - Body: 1rem (16px), font-weight 400 - standard text
  - Small: 0.875rem (14px), font-weight 500 - labels, metadata
  - Tiny: 0.75rem (12px), font-weight 400 - status indicators

### Layout System
**Spacing Scale**: Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Component padding: p-6
- Section spacing: py-12 to py-20
- Card gaps: gap-6
- Form field spacing: space-y-4
- Button padding: px-6 py-3

### Component Library

#### Authentication Pages (Login/Register)
- **Layout**: Centered card on full viewport (min-h-screen flex items-center justify-center)
- **Card**: max-w-md w-full, rounded-xl, p-8
- **Form Structure**:
  - Logo/branding at top (h-12 mb-8)
  - Title (H2) + subtitle (text-sm mb-6)
  - Form fields with floating labels or top-aligned labels
  - Input fields: rounded-lg, px-4 py-3, w-full
  - Submit button: w-full, rounded-lg, px-6 py-3, font-semibold
  - Switch link below (text-sm, centered)
- **Visual Element**: Subtle grid pattern background or geometric shapes

#### Dashboard Layout
- **Structure**: Fixed sidebar (w-64) + main content area
- **Sidebar Navigation**:
  - Logo/brand (h-16 px-6)
  - Navigation links (px-6 py-3, rounded-lg, font-medium)
  - User profile section at bottom (px-6 py-4)
- **Main Content**:
  - Header bar (h-16, px-8, flex items-center justify-between)
  - Content area (px-8 py-6)
  - Breadcrumbs when applicable (mb-6)

#### Bot Management Dashboard
- **Header Section**:
  - Title "My Bots" (H1) + Add Bot button (right-aligned)
  - Stats row below: Total Bots, Active, Stopped (grid-cols-3 gap-6 mb-8)
  
- **Warning Banner**:
  - Prominent placement above bot grid (mb-8)
  - Rounded-lg, px-6 py-4
  - Icon (alert triangle) + bold text + description
  - Border accent (border-l-4)

- **Bot Grid**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
  
- **Bot Card Structure**:
  - Rounded-xl, p-6
  - Header: Bot name (H3) + status badge (rounded-full px-3 py-1 text-xs font-semibold)
  - Technical details grid (grid-cols-2 gap-4 my-4):
    - Host, Port (monospace font)
    - Version, Mode (cracked indicator)
  - Action buttons row (flex gap-3):
    - Start (px-4 py-2, rounded-lg, flex-1)
    - Stop (px-4 py-2, rounded-lg, flex-1)
    - Delete (icon button, p-2, rounded-lg)

#### Add Bot Modal/Form
- **Overlay**: Full screen, semi-transparent backdrop
- **Modal**: max-w-lg, rounded-xl, p-8
- **Form Layout**:
  - Title (H2, mb-6)
  - Form fields (space-y-4):
    - Bot Name (text input)
    - Host (text input with placeholder "play.example.com")
    - Port (number input, default 25565)
    - Version dropdown (1.8.9, 1.12.2, 1.16.5, 1.19, etc.)
    - Cracked Only checkbox (checked, disabled with explanation)
  - Button group (flex justify-end gap-3 mt-8):
    - Cancel (outlined style)
    - Add Bot (filled primary)

#### Status Indicators
- **Badge Styles**: 
  - Online: rounded-full px-3 py-1 text-xs font-semibold
  - Offline: same structure, different treatment
  - Connecting: animated pulse effect
- **Dot Indicators**: w-2 h-2 rounded-full (for compact status)

#### Navigation Elements
- **Top Bar**: User dropdown (right), notification icon, settings
- **Breadcrumbs**: text-sm, separated by chevrons, last item font-semibold

### Icons
**Library**: Heroicons (via CDN)
- Navigation: home, server, cog, user
- Actions: play, stop, trash, plus
- Status: check-circle, x-circle, exclamation-triangle
- Form: envelope, lock, eye, eye-slash

### Animations
**Minimal Implementation**:
- Button hover: subtle scale (scale-105) with transition-transform
- Modal entrance: fade + scale from center
- Status badge pulse for "Connecting" state only
- Sidebar navigation active state: no animation, just visual indicator

### Responsive Behavior
- **Mobile (<768px)**: 
  - Hide sidebar, show hamburger menu
  - Bot grid: single column
  - Stats: stack vertically
- **Tablet (768-1024px)**:
  - Bot grid: 2 columns
  - Maintain sidebar
- **Desktop (>1024px)**:
  - Bot grid: 3 columns
  - Full layout with sidebar

### Form Design Consistency
- All inputs: rounded-lg, consistent height (h-12)
- Labels: text-sm font-medium mb-2
- Helper text: text-xs mt-1
- Error states: border accent + error message below
- Focus states: ring treatment (ring-2)

### Data Display
- **Technical Information**: Always use monospace font (JetBrains Mono)
- **Tables** (if needed): Striped rows, hover states, sticky headers
- **Empty States**: Centered icon + message + CTA button

This design creates a professional, gaming-oriented bot management platform with clear information hierarchy, efficient workflows, and technical aesthetics that appeal to Minecraft server enthusiasts while maintaining enterprise-grade usability.