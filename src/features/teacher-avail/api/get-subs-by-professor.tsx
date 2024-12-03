import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export const getSubjectsByProfessor = ({
  userId,
}: {
  userId: number;
}): Promise<{
  message: string;
  suitabilities: [
    {
      userId: number;
      codeSubject: string;
    },
  ];
}> => {
  return api.get(`/get_suitabilities_by_professor`, { params: { userId } });
};

export const getSubjectsByProfessorQueryOptions = (userId: number) => {
  return queryOptions({
    queryKey: ['get_suitabilities_by_professor'],
    queryFn: () => getSubjectsByProfessor({ userId }),
  });
};

type UseSubjectsByProfessorOptions = {
  userId: number;
  queryConfig?: QueryConfig<typeof getSubjectsByProfessorQueryOptions>;
};

export const useSubjectsByProfessor = ({
  userId,
  queryConfig,
}: UseSubjectsByProfessorOptions) => {
  return useQuery({
    ...getSubjectsByProfessorQueryOptions(userId),
    ...queryConfig,
  });
};
