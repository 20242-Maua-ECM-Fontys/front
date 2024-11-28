import { Button } from '@/components/ui/button';

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="z-10 w-full max-w-sm">
        <Button onClick={onSuccess} className="w-full">
          Log in with your Microsoft Account
        </Button>
      </div>
      <div className="z-10 mt-2 flex items-center justify-end">
        <div className="text-sm">
          <span className="font-medium text-gray-400">
            Need an account? Please contact a staff member.
          </span>
        </div>
      </div>
    </div>
  );
};
