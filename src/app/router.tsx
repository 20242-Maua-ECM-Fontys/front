import { useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppRoot } from './routes/app/root';

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      lazy: async () => {
        const { LandingRoute } = await import('./routes/landing');
        return { Component: LandingRoute };
      },
    },
    {
      path: '/login', // Add the authentication route here
      lazy: async () => {
        const { LoginRoute } = await import(
          '@/app/routes/authentication/login'
        );
        return { Component: LoginRoute };
      },
    },
    {
      path: '/signup', // Add the authentication route here
      lazy: async () => {
        const { RegisterRoute } = await import(
          '@/app/routes/authentication/register'
        );
        return { Component: RegisterRoute };
      },
    },
    {
      path: '/app',
      element: <AppRoot />,
      children: [],
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
