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
          path: 'time-register',
          lazy: async () => {
            const { TimeRegisterRoute } = await import(
              './routes/app/time-register'
            );
            return { Component: TimeRegisterRoute };
          },
        },
        {
          path: 'dashboard',
          lazy: async () => {
            const { DashboardRoute } = await import('./routes/app/dashboard');
            return { Component: DashboardRoute };
          },
        },
        {
          path: 'teacher-suitavail',
          lazy: async () => {
            const { TeacherSuitAvailRoute } = await import(
              './routes/app/teacher-suitavail'
            );
            return { Component: TeacherSuitAvailRoute };
          },
        },
        {
          path: 'coord-suitavail',
          lazy: async () => {
            const { CoordinatorSuitAvailRoute } = await import(
              './routes/app/coordinator-suitavail'
            );
            return { Component: CoordinatorSuitAvailRoute };
          },
        },
        {
          path: 'coord-schedule',
          lazy: async () => {
            const { CoordScheduleRoute } = await import(
              './routes/app/coord-schedule'
            );
            return { Component: CoordScheduleRoute };
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
