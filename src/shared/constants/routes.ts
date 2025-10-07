export const ROUTES = {
  HOME: '/',
  MENU: '/menu',
  CART: '/cart',
  PROFILE: '/profile',
  ORDERS: '/orders',
  CHECKOUT: '/checkout',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Additional routes
  LOCATIONS: '/locations',
  AI_ASSISTANT: '/ai',
  ADMIN: '/admin',
  TRACKING: '/tracking',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
