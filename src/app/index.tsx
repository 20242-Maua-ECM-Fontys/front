import { AppProvider } from './provider';
import { AppRouter } from './router';

import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from 'src/components/layouts/auth-config';


const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();



export const App = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </MsalProvider>
  );
};
