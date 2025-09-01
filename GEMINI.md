# CRNMN Website

## Project Overview

This is a modern, feature-rich web application for "CRNMN," a fictional brand. The project is built with **React** and **Vite**, using **TypeScript** for type safety and **Tailwind CSS** for styling. It's a single-page application (SPA) with a component-based architecture.

Key technologies and features include:

*   **Frontend:** React, Vite, TypeScript, Tailwind CSS
*   **State Management:** Zustand
*   **UI Components:** Radix UI, custom components
*   **Testing:** Jest, React Testing Library, Cypress (for E2E)
*   **Deployment:** Configured for Vercel
*   **AI Integration:** Features using Gemini and other AI SDKs.
*   **Other Features:** Progressive Web App (PWA) capabilities, authentication, shopping cart, order tracking, and more.

## Building and Running

### Prerequisites

*   Node.js (>=18.0.0)
*   npm (>=8.0.0)

### Installation

Install the project dependencies:

```bash
npm i
```

### Development

To start the local development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

The output will be in the `dist` directory.

### Testing

*   **Unit/Integration Tests:**

    ```bash
    npm test
    ```

*   **Run tests in watch mode:**

    ```bash
    npm run test:watch
    ```

*   **View test coverage:**

    ```bash
    npm run test:coverage
    ```

*   **End-to-End (E2E) Tests:**

    ```bash
    # Run Cypress tests headlessly
    npm run e2e

    # Open the Cypress test runner
    npm run e2e:open
    ```

## Development Conventions

*   **Component-Based Architecture:** The application is structured around reusable React components located in `src/components`.
*   **Styling:** Tailwind CSS is used for styling, with custom styles in `src/index.css`.
*   **State Management:** Global state is managed with Zustand. Store logic is likely located in `src/store`.
*   **Type Safety:** TypeScript is used throughout the project.
*   **Linting:** ESLint is configured to enforce code quality. Run `npm run lint` to check for issues.
*   **Testing:** The project uses a combination of Jest for unit/integration tests and Cypress for end-to-end testing. Test files are located alongside the source code in `__tests__` directories or with `.test.ts(x)` or `.spec.ts(x)` extensions.
