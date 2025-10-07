import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { router } from "./src/app/router/router";
import "./src/index.css";
import { QueryProvider } from "./src/providers/QueryProvider";
import { ThemeProvider } from "next-themes";
import "./src/react-global";
import { EnhancedErrorBoundary } from "./src/components/ui/EnhancedErrorBoundary";
import { PWARegistration } from "./src/components/PWARegistration";

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
      <HelmetProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <PWARegistration />
            <RouterProvider router={router} />
          </QueryProvider>
        </ThemeProvider>
      </HelmetProvider>
    </EnhancedErrorBoundary>
  );
};

createRoot(document.getElementById("root")!).render(<AppWrapper />);
