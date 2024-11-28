import { useMsal } from '@azure/msal-react';

import { ContentLayout } from '@/components/layouts';
import { useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
type DashboardContext = {
  setTitle: (title: string) => void;
};
export const DashboardRoute = () => {
  const { accounts } = useMsal();
  const { setTitle } = useOutletContext<DashboardContext>();

  useEffect(() => {
    setTitle('Dashboard'); // Set the desired title
  }, [setTitle]);
  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xl">
        Welcome <b>{`${accounts[0]?.name}`}</b>
      </h1>

      {/* <h4 className="my-3">
        Your role is : <b>{user.data?.role}</b>
      </h4>
      <p className="font-medium">In this application you can:</p>
      {user.data?.role === ROLES.STAFF && (
        <ul className="my-4 list-inside list-disc">
          <li>Upload professor, subject and course data</li>
        </ul>
      )} */}
      {/* {user.data?.role === ROLES.PROFESSOR && (
        <ul className="my-4 list-inside list-disc">
          <li>Create discussions</li>
          <li>Edit discussions</li>
          <li>Delete discussions</li>
          <li>Comment on discussions</li>
          <li>Delete all comments</li>
        </ul>
      )} */}
    </ContentLayout>
  );
};
