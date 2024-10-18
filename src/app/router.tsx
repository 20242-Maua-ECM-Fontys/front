import { useMemo } from 'react';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import { ProtectedRoute } from '../lib/auth';

import { AppRoot } from './routes/app/root';

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/auth/login" />,
    },
    {
      path: '/auth/login', // Add the authentication route here
      lazy: async () => {
        const { LoginRoute } = await import('@/app/routes/auth/login');
        return { Component: LoginRoute };
      },
    },
    {
      path: '/auth/register', // Add the authentication route here
      lazy: async () => {
        const { RegisterRoute } = await import('@/app/routes/auth/register');
        return { Component: RegisterRoute };
      },
    },
    {
      path: '/app',
      element: (
        <ProtectedRoute>
          <AppRoot />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '',
          lazy: async () => {
            const { DashboardRoute } = await import('./routes/app/dashboard');
            return { Component: DashboardRoute };
          },
        },
      ],
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('./routes/not-found');
        return { Component: NotFoundRoute };
      },
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);

  return <RouterProvider router={router} />;
};
