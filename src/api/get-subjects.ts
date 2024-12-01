import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import type { Subject } from '@/types/api';

export const getSubjects = (): Promise<{
  message: string;
  subjects: Subject[];
}> => {
  return api.get(`/get_all_subjects`);
};

export const getSubjectsQueryOptions = () => {
  return queryOptions({
    queryKey: ['get_all_subjects'],
    queryFn: () => getSubjects(),
  });
};

type UseSubjectsOptions = {
  queryConfig?: QueryConfig<typeof getSubjectsQueryOptions>;
};

export const useSubjects = ({ queryConfig }: UseSubjectsOptions) => {
  return useQuery({
    ...getSubjectsQueryOptions(),
    ...queryConfig,
  });
};
