# kAIros - AI-Powered Scrum Master Coaching Platform

## Overview

kAIros is an AI-powered coaching platform designed to help Scrum Masters and Agile Coaches improve their facilitation skills through practice and real-time feedback. The application provides two main features: team engagement tools (icebreakers and activities) and a Scrum event simulator that allows users to practice handling challenging scenarios in a safe environment. Named after the Greek concept of "the opportune moment," kAIros focuses on providing coaching exactly when it's needed most.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using React with TypeScript and follows a component-based architecture. The UI leverages Radix UI components for accessibility and consistency, styled with Tailwind CSS for responsive design. The application uses React Query (TanStack Query) for efficient server state management and API communication. The frontend is organized into logical modules:

- **Components**: Reusable UI components organized by feature (icebreaker, simulator, ui)
- **Hooks**: Custom React hooks for shared logic and state management
- **Pages**: Route-level components for different application sections
- **Services**: API communication layer with typed interfaces

### Backend Architecture
The server is built with Express.js in TypeScript using an ESM module system. It follows a RESTful API design pattern with clear separation of concerns:

- **Routes**: API endpoint definitions with input validation using Zod
- **Services**: Business logic abstraction, particularly for AI provider integration
- **Storage**: Data persistence layer with interface-based design for flexibility
- **Knowledge Base**: Structured Scrum framework knowledge to enhance AI responses

### Data Storage Solutions
The application uses a hybrid storage approach:

- **Development**: In-memory storage implementation for rapid development and testing
- **Production Ready**: Drizzle ORM configured for PostgreSQL with schema-first design
- **Session Management**: PostgreSQL session storage using connect-pg-simple
- **Database Migrations**: Managed through Drizzle Kit for version control

### Authentication and Authorization
Currently implements a simplified authentication model focused on user experience. The architecture supports session-based authentication with PostgreSQL session storage, preparing for future user management features while maintaining development velocity.

### AI Integration Architecture
The application features a flexible AI service layer that can work with multiple providers:

- **Primary Provider**: OpenAI GPT-4o for high-quality conversational AI
- **Fallback Options**: OpenRouter and Anthropic Claude for redundancy
- **Enhanced Context**: Integration with comprehensive Scrum knowledge base and pattern library
- **Scenario Engine**: Predefined challenge scenarios with difficulty progression

## External Dependencies

### Core AI Services
- **OpenAI API**: Primary AI provider for generating icebreakers, activities, and simulation responses
- **OpenRouter**: Alternative AI provider for model diversity and redundancy
- **Anthropic Claude**: Additional AI provider option for different response styles

### Database and Storage
- **Neon Database**: PostgreSQL hosting for production data persistence
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **connect-pg-simple**: PostgreSQL session store for user session management

### UI and Design System
- **Radix UI**: Accessible, unstyled component primitives for consistent UX
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent visual elements
- **Inter Font**: Google Fonts integration for typography

### Development and Build Tools
- **Vite**: Fast build tool and development server with HMR
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Plugins**: Development environment integration and theme management

### State Management and API
- **TanStack React Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with validation
- **Zod**: Runtime type validation for API inputs and data schemas

### Deployment and Hosting
- **Replit**: Integrated development and hosting environment
- **Node.js**: Runtime environment for the Express.js backend
- **ESM Modules**: Modern JavaScript module system throughout the stack