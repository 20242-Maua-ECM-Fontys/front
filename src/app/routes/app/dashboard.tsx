import { useMsal } from '@azure/msal-react';

import { ContentLayout } from '@/components/layouts';
import { useOutletContext } from 'react-router-dom';
import { useEffect } from 'react';
type DashboardContext = {
  // set title to empty string
  setTitle: (title: string) => void;

};
import AnimatedGridPattern from '@/components/ui/animated-grid-pattern';

export const DashboardRoute = () => {
  const { accounts } = useMsal();
  const { setTitle } = useOutletContext<DashboardContext>();

  useEffect(() => {
    setTitle('Dashboard'); // Set the desired title
  }, [setTitle]);
  return (
    <ContentLayout title="Dashboard">
      <AnimatedGridPattern className="fixed inset-0 inset-y-[-30%] z-0 h-[200%] w-full skew-y-12 opacity-30" />

      <div className="flex h-full items-center justify-center pt-20">
        <h1 className="p-4 text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          <span className="block">Welcome to</span>
          <span className="block text-blue-600">Maua Grid</span>
          <p className="p-4 text-3xl">Hello {`${accounts[0]?.name}`} !</p>
        </h1>
      </div>
    </ContentLayout>
  );
};
