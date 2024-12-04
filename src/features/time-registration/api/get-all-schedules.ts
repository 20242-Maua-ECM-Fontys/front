import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import type { Courses } from '@/types/api';

export const getSchedules = (): Promise<{
  message: string;
  courses: Courses;
}> => {
  return api.get(`/get_all_schedules`);
};

export const getSchedulesQueryOptions = () => {
  return queryOptions({
    queryKey: ['get_all_schedules'],
    queryFn: () => getSchedules(),
  });
};

type UseSchedulesOptions = {
  queryConfig?: QueryConfig<typeof getSchedulesQueryOptions>;
};

export const useSchedules = ({ queryConfig }: UseSchedulesOptions) => {
  return useQuery({
    ...getSchedulesQueryOptions(),
    ...queryConfig,
  });
};
