import { useEffect } from 'react';
import { useOutletContext } from 'react-router';

import { ContentLayout } from '../../../components/layouts';
import { CreateCSV } from '../../../features/upload-csv/components/create-csv';

type DashboardContext = {
  setTitle: (title: string) => void;
};
export const UploadRoute = () => {
  const { setTitle } = useOutletContext<DashboardContext>();

  useEffect(() => {
    setTitle('Upload your CSV files'); // Set the desired title
  }, [setTitle]);
  return (
    <ContentLayout title="Upload">
      <CreateCSV />
    </ContentLayout>
  );
};
