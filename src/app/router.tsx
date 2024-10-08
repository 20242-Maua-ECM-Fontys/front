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
      element: <Navigate to="/app" replace />,
    },
    {
      path: '/app',
      element: <AppRoot />,
      children: [
        {
          path: 'upload',
          lazy: async () => {
            const { UploadRoute } = await import('./routes/app/upload');
            return { Component: UploadRoute };
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
