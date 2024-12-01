import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import type { Professors } from '@/types/api';

export const getProfessors = (): Promise<{
  message: string;
  professors: Professors;
}> => {
  return api.get(`/get_all_professors`);
};

export const getProfessorsQueryOptions = () => {
  return queryOptions({
    queryKey: ['get_all_professors'],
    queryFn: () => getProfessors(),
  });
};

type UseProfessorsOptions = {
  queryConfig?: QueryConfig<typeof getProfessorsQueryOptions>;
};

export const useProfessors = ({ queryConfig }: UseProfessorsOptions) => {
  return useQuery({
    ...getProfessorsQueryOptions(),
    ...queryConfig,
  });
};
