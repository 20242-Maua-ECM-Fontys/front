import { useMsal } from '@azure/msal-react';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '@/assets/images/MauaGrid-logo.svg';
import { Head } from '@/components/seo';
import { Link } from '@/components/ui/link';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AuthLayout = ({ children, title }: LayoutProps) => {
  const { accounts } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    if (accounts.length > 0) {
      navigate('/app', { replace: true });
    }
  }, [accounts, navigate]);

  return (
    <>
      <Head title={title} />
      <div className="flex min-h-screen flex-col justify-center bg-blue-800 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
          <Link className="flex items-center text-white" to="/">
            <img className="h-24 w-auto" src={logo} alt="Workflow" />
          </Link>
          <h2 className="w-80 text-center text-xl font-extrabold leading-relaxed text-white sm:w-[50rem] sm:leading-normal">
            Building your Schedules in a straightforward manner
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
