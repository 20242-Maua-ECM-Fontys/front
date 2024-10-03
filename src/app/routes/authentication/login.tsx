import { AuthLayout } from '@/components/layouts/auth-layout'; // Adjust the path as necessary
import { LoginForm } from '@/features/auth/components/login-form';

export const LoginRoute = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};
