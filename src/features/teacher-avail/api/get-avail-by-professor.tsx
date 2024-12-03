import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Availability } from '@/types/api';

export const getAvailByProfessor = ({
  userId,
}: {
  userId: number;
}): Promise<{
  message: string;
  availabilities: Availability[];
}> => {
  return api.get(`/get_availabilities_by_professor`, { params: { userId } });
};

export const getAvailByProfessorQueryOptions = (userId: number) => {
  return queryOptions({
    queryKey: ['get_availabilities_by_professor'],
    queryFn: () => getAvailByProfessor({ userId }),
  });
};

type UseAvailByProfessorOptions = {
  userId: number;
  queryConfig?: QueryConfig<typeof getAvailByProfessorQueryOptions>;
};

export const useAvailByProfessor = ({
  userId,
  queryConfig,
}: UseAvailByProfessorOptions) => {
  return useQuery({
    ...getAvailByProfessorQueryOptions(userId),
    ...queryConfig,
  });
};
