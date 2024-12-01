import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

import type { MutationConfig } from '../../../lib/react-query';
import type { WeekDays } from '../types/availability';

export const createStaffAvailability = ({
  scheduleId,
  data,
}: {
  data: Partial<
    Record<
      WeekDays,
      {
        notEarlier: number;
        notLater: number;
      }
    >
  >;
  scheduleId: string;
}): Promise<string> => {
  return api.post('/create_possibilities', {
    scheduleId: scheduleId,
    dates: data,
  });
};

type UseCreateStaffAvailabilityOptions = {
  mutationConfig?: MutationConfig<typeof createStaffAvailability>;
};

export const useCreateStaffAvailability = ({
  mutationConfig,
}: UseCreateStaffAvailabilityOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createStaffAvailability,
  });
};
