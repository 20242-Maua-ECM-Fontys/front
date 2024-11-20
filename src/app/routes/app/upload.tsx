import { ContentLayout } from '../../../components/layouts';
import { CreateCSV } from '../../../features/upload-csv/components/create-csv';

export const UploadRoute = () => {
  return (
    <ContentLayout title="Upload">
      <CreateCSV />
    </ContentLayout>
  );
};
