import { createContext, ReactNode, useState } from 'react';

type UserContext = {
  userId: number;
  name: string;
  email: string;
  role: string;
  setUser: (user: UserContext) => void;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserContext>({
    userId: 0,
    name: '',
    email: '',
    role: '',
    setUser: () => {
      throw new Error('setUser must be used inside a UserProvider');
    },
  });

  return (
    <UserContext.Provider value={{ ...user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
