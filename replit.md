# AI-Based Intelligent Note App

## Overview

This is an AI-powered note-taking application called "Memorize" that automatically analyzes, categorizes, and stores user input through a conversational chat interface. The application uses AI to extract structured information from natural language input and organizes it into categorized memories for easy retrieval.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with a Notion-inspired design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Layout**: Three-panel layout with sidebar, main content area, and floating chat interface

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Development**: Hot reload with Vite middleware integration

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Two main tables - categories and memories with JSONB for structured data
- **Development Storage**: In-memory storage implementation for development/testing
- **Connection**: Neon Database serverless PostgreSQL

## Key Components

### Chat Interface
- KakaoTalk-style speech bubble interface
- Real-time message display with user/AI distinction
- Fixed bottom input with auto-resize textarea
- AI typing indicators and analysis feedback

### Memory Management
- Automatic content analysis using OpenAI GPT-4o
- Structured data extraction (keywords, tags, categories)
- Memory categorization with predefined categories (Game Account, Schedule, Contact, Idea, Quick Note)
- Search functionality across all memories

### Category System
- Icon-based category visualization
- Color-coded organization
- Memory count tracking
- Predefined categories with extensibility

### Data Display
- Table, grid, and list view modes
- Filtering by category and search terms
- Progress indicators for AI confidence scores
- Responsive design for mobile and desktop

## Data Flow

1. **User Input**: User types message in chat interface
2. **AI Analysis**: Content sent to OpenAI API for analysis
3. **Content Processing**: AI extracts title, category, keywords, tags, and structured data
4. **Storage**: Processed memory stored in database with analysis results
5. **UI Update**: Interface updates with new memory and category counts
6. **Retrieval**: Users can search and filter memories through the main interface

## External Dependencies

### AI Integration
- **OpenAI API**: GPT-4o model for content analysis and categorization
- **Analysis Features**: Automatic title generation, category assignment, keyword extraction, and structured data parsing

### UI Components
- **Radix UI**: Comprehensive component primitives for accessibility
- **Shadcn/ui**: Pre-built component library with consistent styling
- **Lucide React**: Icon library for UI elements

### Development Tools
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Fast bundling for production builds
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` using Vite
- Backend bundles to `dist/index.js` using ESBuild
- TypeScript compilation check without emit

### Environment Requirements
- **DATABASE_URL**: PostgreSQL connection string (required)
- **OPENAI_API_KEY**: OpenAI API key for content analysis
- **NODE_ENV**: Environment specification (development/production)

### Development Workflow
- Development server runs with hot reload
- Database schema managed through Drizzle migrations
- Automatic error overlay for runtime issues
- Replit integration for development environment

### Production Considerations
- Serverless-compatible architecture
- External PostgreSQL database required
- Environment variable configuration
- Static asset serving through Express