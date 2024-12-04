import { useMsal } from '@azure/msal-react';

import { useRole } from '@/api/get-role-by-email';

export const useUser = () => {
  const { instance } = useMsal();
  const currentAccount = instance.getActiveAccount();

  const roleQuery = useRole({ email: currentAccount?.username ?? '' });

  return {
    role: roleQuery.data?.role,
    isLoading: roleQuery.isLoading,
    error: roleQuery.error,
  };
};
