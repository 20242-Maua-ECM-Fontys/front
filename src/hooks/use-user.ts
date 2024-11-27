import axios from 'axios';
import { useContext } from 'react';

import { UserContext } from '@/context/user-context';

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used inside a UserProvider');
  }
  const { userId, email, role, setUser } = context;

  const getUser = async (email: string) => {
    const response = await axios.get(
      import.meta.env.VITE_APP_API_URL + 'get_role_by_email',
      { params: { email } },
    );
    const { userId, role } = response.data;
    setUser({
      userId,
      role,
      email,
      setUser,
    });
    console.log(userId + ' ' + role + ' ' + email);
  };

  return { userId, email, role, getUser };
};
