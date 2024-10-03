import { AuthLayout } from '@/components/layouts/auth-layout';
import { LoginForm } from '@/features/auth/components/login-form';

export const LoginRoute = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};
