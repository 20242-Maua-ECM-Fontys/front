import { AuthLayout } from '@/components/layouts/auth-layout';
import { RegisterForm } from '@/features/auth/components/register-form';
export const RegisterRoute = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};
