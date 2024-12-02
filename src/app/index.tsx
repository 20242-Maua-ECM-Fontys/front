import { Toaster } from '@/components/ui/toaster';
import { UserProvider } from '@/context/user-context';

import { AppProvider } from './provider';
import { AppRouter } from './router';

export const App = () => {
  return (
    <UserProvider>
      <AppProvider>
        <AppRouter />
        <Toaster />
      </AppProvider>
    </UserProvider>
  );
};
