import { useMemo } from 'react';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import { AppRoot } from './routes/app/root';

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/auth/login" replace />,
    },
    {
      path: '/auth/login',
      lazy: async () => {
        const { LoginRoute } = await import('./routes/auth/login');
        return { Component: LoginRoute };
      },
    },
    {
      path: '/app',
      element: <AppRoot />,
      children: [
        {
          path: '',
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: 'upload',
          lazy: async () => {
            const { UploadRoute } = await import('./routes/app/upload');
            return { Component: UploadRoute };
          },
        },
        {
          path: 'time-registration',
          lazy: async () => {
            const { TimeRegistrationRoute } = await import(
              './routes/app/time-registration'
            );
            return { Component: TimeRegistrationRoute };
          },
        },
        {
          path: 'dashboard',
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
