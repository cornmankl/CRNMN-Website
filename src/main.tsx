import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryProvider } from './providers/QueryProvider'
import { ThemeProvider } from 'next-themes'
import './react-global'
import { EnhancedErrorBoundary } from './components/ui/EnhancedErrorBoundary'

const AppWrapper = () => {
  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo) => {
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
)