import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "next-themes";
import "./react-global";
import { EnhancedErrorBoundary } from "./src/components/ui/EnhancedErrorBoundary";

// Main App Wrapper
const AppWrapper = () => {
  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo) => {
        // Custom error handling
        console.error('Application Error:', error, errorInfo);
      }}
      resetOnPropsChange={true}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <QueryProvider>
          <App />
        </QueryProvider>
      </ThemeProvider>
    </EnhancedErrorBoundary>
  );
};

createRoot(document.getElementById("root")!).render(<AppWrapper />);
