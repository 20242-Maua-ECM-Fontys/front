import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <Navigate
      to={`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`}
      replace
    />
  );

  return children;
};
