import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

import type { MutationConfig } from '../../../lib/react-query';

export const createCSV = ({ data }: { data: FormData }): Promise<string> => {
  return api.post('/upload_csv', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseCreateCsvOptions = {
  mutationConfig?: MutationConfig<typeof createCSV>;
};

export const useCreateCsv = ({ mutationConfig }: UseCreateCsvOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createCSV,
  });
};
