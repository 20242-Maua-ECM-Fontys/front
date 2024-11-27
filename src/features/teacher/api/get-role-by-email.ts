import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getRole = ({
  email,
}: {
  email: string;
}): Promise<{
  userId: number;
  role: 'ADMIN' | 'TEACHER' | 'STAFF' | 'COORINATOR';
  message: string;
}> => {
  return api.get('/get_role_by_email', { params: { email } });
};

export const getRoleQueryOptions = (email: string) => {
  return queryOptions({
    queryKey: ['get_role_by_email'],
    queryFn: () => getRole({ email }),
  });
};

type UseRoleOptions = {
  email: string;
  queryConfig?: QueryConfig<typeof getRoleQueryOptions>;
};

export const useRole = ({ email, queryConfig }: UseRoleOptions) => {
  return useQuery({
    ...getRoleQueryOptions(email),
    ...queryConfig,
  });
};
