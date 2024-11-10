import axios from 'axios';
import { useContext } from 'react';

import { UserContext } from '@/context/user-context';

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used inside a UserProvider');
  }
  const { userId, name, email, role, setUser } = context;

  const getUser = async (email: string) => {
    const response = await axios.get(
      import.meta.env.VITE_APP_API_URL + 'get_role_by_email',
      { params: { email } },
    );
    const user = response.data;
    setUser(user);
    console.log(user);
  };

  return { userId, name, email, role, getUser };
};
