import { ContentLayout } from '../../../components/layouts';
import { CreateCSV } from '../../../features/upload-csv/components/create-csv';
import { useOutletContext } from 'react-router';
import { useEffect } from 'react';

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
