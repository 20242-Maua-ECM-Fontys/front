import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/context/user-context';
import { msalConfig } from 'src/components/layouts/auth-config';

import { AppProvider } from './provider';
import { AppRouter } from './router';

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();

export const App = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <UserProvider>
        <AppProvider>
          <AppRouter />
          <Toaster />
        </AppProvider>
      </UserProvider>
    </MsalProvider>
  );
};
