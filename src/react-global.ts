// Global React setup to prevent "React is not defined" errors
import React from 'react';

// Make React available globally
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Also make it available in global scope
if (typeof global !== 'undefined') {
  (global as any).React = React;
}

export default React;