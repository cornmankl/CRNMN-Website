import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '../layouts/RootLayout';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('../../pages/HomePage'));
const MenuPage = lazy(() => import('../../pages/MenuPage'));
const CartPage = lazy(() => import('../../pages/CartPage'));
const ProfilePage = lazy(() => import('../../pages/ProfilePage'));
const OrdersPage = lazy(() => import('../../pages/OrdersPage'));

// Error boundary component
const ErrorPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p className="text-muted-foreground">Something went wrong.</p>
      <a href="/" className="btn-primary inline-block">
        Go Home
      </a>
    </div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'menu',
        element: <MenuPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
    ],
  },
]);
