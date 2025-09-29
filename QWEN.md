# CRNMN Website - Project Context for Qwen Code

## Project Overview

This is the CRNMN Website, a modern, feature-rich web application built with React, Vite, TypeScript, and Tailwind CSS. It's a single-page application (SPA) with a component-based architecture designed for a fictional corn-themed brand.

### Core Technologies

* **Frontend Framework:** React with TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **State Management:** Zustand
* **UI Components:** Radix UI, Lucide React icons, and custom components
* **Authentication & Backend:** Supabase (Auth, Database, Storage)
* **AI Integration:** Google Gemini (primary), OpenAI, Anthropic, GLM
* **Testing:** Jest (unit/integration), Cypress (E2E)
* **Deployment:** Vercel-ready with PWA capabilities

### Key Features

* **E-commerce Functionality:** Shopping cart, product listings, order tracking
* **User Authentication:** Sign up, login, profile management
* **AI Assistant:** Multi-provider AI chat and advanced features (Gemini, OpenAI, Anthropic)
* **Progressive Web App (PWA):** Installable on devices with offline capabilities
* **Responsive Design:** Mobile-first approach with Tailwind CSS
* **Real-time Features:** Notifications, potentially real-time updates

## Project Structure

```
src/
├── components/          # React components
├── store/               # Zustand global state stores
├── utils/               # Utility functions and services
│   ├── ai/              # AI service integration
│   └── supabase/        # Supabase client configuration
├── providers/           # React context providers
└── ...
```

## AI Integration

The project has a sophisticated AI integration system:

* **Multi-Provider Support:** Google Gemini (default), OpenAI, Anthropic, GLM
* **AI Dashboard:** Central interface for AI features with tabs for Chat, Gemini, Modifier, Settings, Tests
* **Gemini Features:** Dedicated tab for advanced Gemini capabilities (text/code generation, creative writing, data analysis)
* **Authentication & Permissions:** AI features are gated by user roles (free, premium, admin)
* **Rate Limiting:** Usage-based access control for different user tiers
* **Usage Tracking:** AI usage statistics and logging

### Gemini AI (Primary Provider)

* Integrated as the default AI provider
* Advanced features include text generation, code generation, creative writing, and data analysis
* Specialized for the "corn business" context with preset prompts
* Permission-based access control (advanced features require premium/admin)

## Development Workflow

### Prerequisites

* Node.js (>=18.0.0)
* npm (>=8.0.0)

### Key Commands

* **Install dependencies:** `npm i`
* **Start development server:** `npm run dev` (runs on port 3000)
* **Build for production:** `npm run build` (outputs to `dist/`)
* **Run tests:**
  * Unit/Integration: `npm test`, `npm run test:watch`, `npm run test:coverage`
  * E2E: `npm run e2e`, `npm run e2e:open`
* **Linting:** `npm run lint`
* **Type checking:** `npm run type-check`

## State Management

The application uses Zustand for global state management with persisted stores for:

* User authentication state
* Shopping cart
* UI preferences and notifications
* Order tracking
* Product listings
* AI recommendations and chat history

## Backend Services

* **Supabase:** Handles user authentication, database operations, and potentially storage
* **API Keys:** Environment variables for AI providers (Gemini, OpenAI, Anthropic, GLM) and Supabase

## Development Conventions

* Component-based architecture with reusable React components
* TypeScript for type safety throughout the codebase
* Tailwind CSS for styling with custom configurations in `src/index.css`
* ESLint for code quality enforcement
* Comprehensive testing strategy with Jest and Cypress