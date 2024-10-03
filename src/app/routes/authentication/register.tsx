import { AuthLayout } from '@/components/layouts/auth-layout'; // Adjust the path as necessary
import { RegisterForm } from '@/features/auth/components/register-form';
export const RegisterRoute = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};
