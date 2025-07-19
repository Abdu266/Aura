# Aura - Migraine Management Application

## Overview

Aura is a comprehensive migraine tracking and management web application built with a modern full-stack architecture. The application helps users log migraine episodes, track triggers, manage medications, and gain insights into their migraine patterns through analytics and AI-powered recommendations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite for development and build tooling
- **Routing**: Client-side routing with Wouter for lightweight navigation
- **State Management**: TanStack Query (React Query) for server state and API caching
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Theme System**: Built-in dark/light mode support with accessibility features

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Request logging, JSON parsing, error handling

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with TypeScript-first schema definitions
- **Migration System**: Drizzle Kit for schema migrations
- **Connection**: Serverless-compatible with connection pooling

## Key Components

### Data Models
- **Users**: Authentication and preferences (theme, accessibility settings)
- **Episodes**: Migraine episode tracking with pain levels, duration, symptoms
- **Triggers**: User-defined migraine triggers with categories
- **Medications**: Medication management and logging
- **Relief Activities**: Tracking of relief techniques and their effectiveness
- **Insights**: AI-generated patterns and recommendations

### API Endpoints
- `/api/episodes` - CRUD operations for migraine episodes
- `/api/triggers` - Trigger management and episode associations
- `/api/medications` - Medication tracking and logging
- `/api/relief-activities` - Relief technique tracking
- `/api/analytics` - Data aggregation and insights
- `/api/insights` - AI-generated recommendations

### Frontend Features
- **Dashboard**: Quick actions, status overview, weekly patterns
- **Episode Logging**: Comprehensive migraine episode recording
- **Analytics**: Visual charts and trend analysis
- **Medication Management**: Dosage tracking and reminders
- **Relief Techniques**: Guided breathing exercises, cold therapy timers
- **Accessibility**: High contrast mode, font size adjustment, screen reader support

## Data Flow

1. **User Interaction**: Users interact with React components in the browser
2. **API Calls**: TanStack Query manages API requests with caching and optimistic updates
3. **Server Processing**: Express.js handles requests, validates data with Zod schemas
4. **Database Operations**: Drizzle ORM performs type-safe database queries
5. **Response**: JSON data flows back through the same path with error handling

## External Dependencies

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **date-fns**: Date manipulation utilities

### Backend Services
- **Neon Database**: Serverless PostgreSQL hosting
- **WebSocket Support**: Real-time capabilities for future features

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast JavaScript bundling for production

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for frontend development
- **Express Server**: API development with automatic restart
- **Database**: Direct connection to Neon PostgreSQL instance

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations ensure schema consistency

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)

### Accessibility Features
- **Theme Support**: System-aware dark/light mode switching
- **Font Scaling**: Multiple font size options for readability
- **High Contrast**: Enhanced contrast mode for visual accessibility
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader**: Proper ARIA labels and semantic HTML

The application follows a mobile-first responsive design approach and includes comprehensive error handling, loading states, and user feedback mechanisms throughout the user experience.