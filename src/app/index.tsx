import {
  EventType,
  PublicClientApplication,
  type AuthenticationResult,
} from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/context/user-context';
import { msalConfig } from 'src/components/layouts/auth-config';

import { AppProvider } from './provider';
import { AppRouter } from './router';

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
