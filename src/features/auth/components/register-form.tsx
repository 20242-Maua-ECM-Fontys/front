import { Link, useSearchParams } from 'react-router-dom';

import Circles from '@/assets/images/Circles.svg';
import { Button } from '@/components/ui/button';
import { Form, Input } from '@/components/ui/form';
import { useRegister, registerInputSchema } from '@/lib/auth';

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const registering = useRegister({ onSuccess });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <div>
      <img
        src={Circles}
        className="absolute right-5 top-0 w-96"
        alt="Decorative circles"
      />
      <Form
        onSubmit={(values) => {
          registering.mutate(values);
        }}
        schema={registerInputSchema}
        options={{
          shouldUnregister: true,
        }}
      >
        {({ register, formState }) => (
          <>
            <Input
              type="text"
              label="First Name"
              error={formState.errors['firstName']}
              registration={register('firstName')}
            />
            <Input
              type="text"
              label="Last Name"
              error={formState.errors['lastName']}
              registration={register('lastName')}
            />
            <Input
              type="email"
              label="Email Address"
              error={formState.errors['email']}
              registration={register('email')}
            />
            <Input
              type="password"
              label="Password"
              error={formState.errors['password']}
              registration={register('password')}
            />
            <div>
              <Button
                isLoading={registering.isPending}
                type="submit"
                className="w-full"
              >
                Register
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link
            to={`/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};
