import { useMsal } from '@azure/msal-react';
import { ContentLayout } from '@/components/layouts';
import AnimatedGridPattern from '@/components/ui/animated-grid-pattern';

export const DashboardRoute = () => {
  const { accounts } = useMsal();

  return (
    <ContentLayout title="Dashboard">
      <AnimatedGridPattern className="fixed inset-0 z-0 h-full w-full opacity-30" />
      
      <div className="z-10 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-center">
          Welcome <b>{`${accounts[0]?.name}`}</b>
        </h1>
      </div>
    </ContentLayout>
  );
};
