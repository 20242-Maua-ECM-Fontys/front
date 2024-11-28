import { useMsal } from '@azure/msal-react';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Circles from '@/assets/images/Circles.svg';

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
      <div className="flex min-h-screen flex-col items-center justify-center sm:px-6 lg:px-8">
        <div className=" w-[40rem] h-[25rem] rounded-2xl drop-shadow-[0px_0px_10px_rgba(0,0,0,0.25)] flex-col flex items-center justify-center">
          <div className="flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-md">
            <Link className="flex items-center" to="/">
              <img className="h-24 w-auto" src={logo} alt="Workflow" />
            </Link>
            <h2
              className="w-80 text-center text-xl font-extrabold leading-relaxed text-gray-500 sm:w-[50rem] sm:leading-normal">
              Building your Schedules in a straightforward manner
            </h2>
          </div>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
              {children}
            </div>
          </div>
        </div>
      </div>
      {/* Decorative circles positioned under the login form */}
      <img
        src={Circles}
        className="absolute bottom-0 left-5 w-96 rotate-180"
        alt="Decorative circles"
      />
    </>
  );
};
