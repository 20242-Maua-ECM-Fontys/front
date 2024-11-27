import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const updateSubjects = ({
  subjectCodes,
  userId,
}: {
  subjectCodes: string[];
  userId: number;
}): Promise<string> => {
  return api.put('/update_suitabilities', {
    userId,
    subjectCodes,
  });
};

type UseUpdateSubjectsOptions = {
  mutationConfig?: MutationConfig<typeof updateSubjects>;
};

export const useUpdateSubjects = ({
  mutationConfig,
}: UseUpdateSubjectsOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (data, ...args) => {
      onSuccess?.(data, ...args);
    },
    ...restConfig,
    mutationFn: updateSubjects,
  });
};
