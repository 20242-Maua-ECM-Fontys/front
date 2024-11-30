import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/hooks/use-user';

export const DashboardRoute = () => {
  const { accounts } = useMsal();
  const { userId, role, getUser } = useUser();

  useEffect(() => {
    if (accounts[0]?.username && userId == 0) {
      getUser(accounts[0]?.username);
    }
  }, [accounts, userId, getUser]);

  return (
    <ContentLayout title="">
      {role ? (
        <div className="flex h-screen items-center">
          <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
            <h1 className="p-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              <span className="block">Welcome to</span>
              <span className="block text-blue-600">Maua Grid</span>
            </h1>
            <p className="p-4 text-lg leading-6">
              Hello {`${accounts[0]?.name}`} !
            </p>
            <h3 className="tracking-tight text-gray-900 sm:text-xl">
              <span className="block">Your role is : {role}</span>
            </h3>
          </div>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <div className="size-32 animate-spin rounded-full border-y-2 border-gray-900"></div>
        </div>
      )}
    </ContentLayout>
  );
};
