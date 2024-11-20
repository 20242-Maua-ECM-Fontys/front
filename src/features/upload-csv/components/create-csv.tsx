import { Cloud } from 'lucide-react';
import { useRef } from 'react';

import { useNotifications } from '@/components/ui/notifications';

import { useCreateCsv } from '../api/create-csv';

export const CreateCSV = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { addNotification } = useNotifications();
  const createCsvMutation = useCreateCsv({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'CSV uploaded successfully',
        });
      },
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const formData = new FormData();
    formData.append('file', file as Blob);
    if (formData) {
      createCsvMutation.mutate({ data: formData });
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const formData = new FormData();
    formData.append('file', file);
    if (formData) {
      createCsvMutation.mutate({ data: formData });
    }
  };

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div
        id="drop-zone"
        className="flex h-1/2 w-full max-w-xl select-none flex-col items-center justify-center rounded-lg border border-dashed border-slate-500 p-4"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            fileInputRef.current?.click();
          }
        }}
      >
        <Cloud size={72} />
        <h1 className="mt-3 text-base font-bold">Import your CSV file</h1>
        <p className="text-xs font-normal">Drag or click to upload</p>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
