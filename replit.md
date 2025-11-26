# Minecraft Bot Manager

## Overview

A professional web-based management platform for Minecraft bots on cracked servers. The application allows users to create accounts, add multiple bot configurations, and manage bot connections with automated anti-AFK functionality and automatic reconnection capabilities. Built with a modern React frontend and Express backend, the platform provides real-time bot status monitoring and control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling

**State Management**: 
- TanStack Query (React Query) for server state management with automatic refetching every 3 seconds for bot status updates
- Local component state with React hooks for UI state

**Routing**: Wouter for lightweight client-side routing

**Design System**:
- Custom design guidelines inspired by Discord and Linear aesthetics
- Typography: Inter font family with JetBrains Mono for technical details
- Spacing scale based on Tailwind units (2, 4, 6, 8, 12, 16, 20)
- Hover and active elevation effects for interactive elements
- Custom color system with HSL-based theming supporting light/dark modes

**Key Pages**:
- Authentication: Login and Register pages with centered card layout
- Dashboard: Main application view with bot management interface

### Backend Architecture

**Framework**: Express.js with TypeScript

**Authentication**: 
- JWT-based authentication with 7-day token expiration
- bcrypt for password hashing (10 salt rounds)
- Custom middleware for protected route authentication
- Token stored in localStorage on client, sent via Authorization header

**Bot Management**:
- Mineflayer library for Minecraft bot connections
- BotManager class maintaining in-memory map of active bot instances
- Automated anti-AFK system with periodic movement commands
- Automatic reconnection with exponential backoff on disconnection
- Support for cracked (offline mode) servers only

**Storage Strategy**:
- In-memory storage implementation (MemStorage) using Map data structures
- Interface-based design (IStorage) allowing future database integration
- Separate storage for users and bots with UUID-based identifiers

**Data Models**:
- Users: id, email, password (hashed)
- Bots: id, userId, botName, host, port, version, status (offline/online/connecting)

**API Structure**:
- RESTful endpoints under `/api` prefix
- Auth routes: `/api/auth/register`, `/api/auth/login`
- Bot routes: CRUD operations for bot management, start/stop controls
- Request logging with timestamp, method, path, status code, and duration

### Development vs Production

**Development Mode**:
- Vite dev server with HMR (Hot Module Replacement)
- Vite middleware integration in Express
- Runtime error overlay and dev banner plugins
- Cartographer plugin for enhanced debugging

**Production Mode**:
- Client built to `dist/public` directory
- Server bundled with esbuild to single `dist/index.cjs` file
- Static file serving from dist directory
- Selective dependency bundling with allowlist for performance

### Code Organization

**Monorepo Structure**:
- `/client` - React frontend application
- `/server` - Express backend application  
- `/shared` - Shared TypeScript schemas and types
- Path aliases: `@/` for client src, `@shared/` for shared code

**Schema Validation**:
- Drizzle ORM schema definitions for type safety
- Zod schemas derived from Drizzle for runtime validation
- Shared between client and server for consistent validation

## External Dependencies

### Database

**Provider**: Neon Database (PostgreSQL)
- Serverless Postgres via `@neondatabase/serverless`
- Connection via `DATABASE_URL` environment variable
- Drizzle ORM configured for PostgreSQL dialect
- Note: Current implementation uses in-memory storage; Postgres integration prepared but not active

### UI Component Libraries

**Radix UI**: Comprehensive set of unstyled, accessible component primitives including:
- Dialog, Dropdown Menu, Popover, Select, Toast
- Accordion, Tabs, Tooltip, Context Menu
- All components customized with Tailwind styling via shadcn/ui pattern

**shadcn/ui**: Component configuration with "new-york" style preset
- CSS variables-based theming
- Custom border radius and color tokens
- Component aliases configured in `components.json`

### Bot Framework

**Mineflayer**: Node.js library for creating Minecraft bots
- Handles protocol-level Minecraft server connections
- Provides entity, world, and chat interaction APIs
- Configured for offline/cracked server authentication only

### Build & Development Tools

**Vite**: Frontend build tool and dev server
- React plugin for JSX/TSX support
- Path resolution with aliases
- Replit-specific plugins for development environment

**esbuild**: Server-side bundling for production
- Bundling allowlisted dependencies to reduce syscalls
- Single output file for improved cold start performance

### Form & Validation

**React Hook Form**: Form state management with `@hookform/resolvers`
- Zod integration for schema validation
- Type-safe form handling

### Styling

**Tailwind CSS**: Utility-first CSS framework
- PostCSS for processing
- Custom configuration with extended color palette and border radius
- Dark mode support via class strategy

### Authentication & Security

**bcrypt**: Password hashing (v6.0.0)
**jsonwebtoken**: JWT token generation and verification

### Environment Requirements

**JWT_SECRET**: Required environment variable for JWT signing (application fails to start if missing)
**DATABASE_URL**: Required for database connection (validated at startup)