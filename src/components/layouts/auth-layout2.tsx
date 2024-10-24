import { ReactNode } from 'react';

import logoImage from '../../assets/images/MauaGrid-logo.svg';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <>
      <div className="relative flex items-center justify-center bg-[#004587]">
        {/* Logo */}
        <div className="absolute top-10 z-20">
          <img src={logoImage} alt="MauaGrid Logo" className="mx-auto h-32" />
        </div>
        {/* Auth Content */}
        <div className="z-10 w-full rounded-lg bg-white shadow-lg">
          {children}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
