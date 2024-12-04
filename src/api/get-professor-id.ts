import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getProfessorId = ({
  email,
}: {
  email: string;
}): Promise<{
  userId: number;
  role: 'ADMIN' | 'TEACHER' | 'STAFF' | 'COORDINATOR';
  message: string;
}> => {
  return api.get('/get_role_by_email', { params: { email } });
};

export const getProfessorIdQueryOptions = (email: string) => {
  return queryOptions({
    queryKey: ['get_professor_id'],
    queryFn: () => getProfessorId({ email }),
  });
};

type UseProfessorIdOptions = {
  email: string;
  queryConfig?: QueryConfig<typeof getProfessorIdQueryOptions>;
};

export const useProfessorId = ({
  email,
  queryConfig,
}: UseProfessorIdOptions) => {
  return useQuery({
    ...getProfessorIdQueryOptions(email),
    ...queryConfig,
  });
};
