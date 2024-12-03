import {
  EventType,
  PublicClientApplication,
  type AuthenticationResult,
} from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { MainErrorFallback } from '@/components/errors/main';
import { Spinner } from '@/components/ui/spinner';
import { msalConfig } from '@/lib/auth';
import { queryConfig } from '@/lib/react-query';

import { Notifications } from '../components/ui/notifications';

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  const msalInstance = new PublicClientApplication(msalConfig);
  msalInstance.initialize();

  msalInstance.addEventCallback((event) => {
    console.log(event);
    if (event.eventType === EventType.LOGIN_SUCCESS) {
      const account = (event.payload as AuthenticationResult)?.account;
      if (account) {
        msalInstance.setActiveAccount(account);
      }
    }
  });

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <MsalProvider instance={msalInstance}>
              {import.meta.env.DEV && <ReactQueryDevtools />}
              <Notifications />
              {children}
            </MsalProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
};
