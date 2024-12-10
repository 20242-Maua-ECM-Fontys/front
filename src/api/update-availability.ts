import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Availability } from '@/types/api';

export const updateAvailability = ({
  availabilities,
  userId,
}: {
  availabilities: Availability[];
  userId: number | string;
}): Promise<string> => {
  return api.put('/update_availabilities', {
    userId,
    availabilities,
  });
};

type UseUpdateAvailabilityOptions = {
  mutationConfig?: MutationConfig<typeof updateAvailability>;
};

export const useUpdateAvailability = ({
  mutationConfig,
}: UseUpdateAvailabilityOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateAvailability,
  });
};
