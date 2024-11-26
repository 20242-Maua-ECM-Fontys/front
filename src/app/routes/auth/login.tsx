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

  const handleLogout = () => {
    instance.logoutPopup().catch((e) => console.error(e));
  };

  useEffect(() => {
    if (accounts.length > 0) {
      navigate('/app', { replace: true });
    }
  }, [accounts, navigate]);

  return (
    <AuthLayout title="MauaGrid">
      {accounts.length > 0 ? (
        <div className="text-center">
          <p>Welcome, {accounts[0].name}</p>
          <p>Username: {accounts[0].username}</p>
          <button
            className="mt-4 rounded bg-gray-200 px-4 transition duration-300 hover:bg-blue-400 hover:text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <LoginForm onSuccess={() => handleLogin()} />
      )}
    </AuthLayout>
  );
};
