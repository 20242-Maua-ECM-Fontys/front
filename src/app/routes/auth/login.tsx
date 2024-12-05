import { useMsal } from '@azure/msal-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthLayout } from '@/components/layouts/auth-layout';
import { LoginForm } from '@/features/auth/components/login-form';

export const LoginRoute = () => {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    instance.loginPopup().catch((e) => console.error(e));
  };

  useEffect(() => {
    if (accounts.length > 0) {
      navigate('/app', { replace: true });
    }
  }, [accounts, navigate]);

  return (
    <AuthLayout title="MauaGrid">
      <LoginForm onSuccess={() => handleLogin()} />
    </AuthLayout>
  );
};
