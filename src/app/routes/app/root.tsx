import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet, useLocation } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';

import { DashboardLayout } from '../../../components/layouts/dashboard-layout';

export const AppRoot = () => {
  const [title, setTitle] = useState('Default Dashboard Title');
  const location = useLocation();

  return (
    <DashboardLayout title={title}>
      <Suspense
        fallback={
          <div className="flex size-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <ErrorBoundary
          key={location.pathname}
          fallback={<div>Something went wrong!</div>}
        >
          <Outlet context={{ setTitle }} />
        </ErrorBoundary>
      </Suspense>
    </DashboardLayout>
  );
};
