import { useContext, createContext, useEffect, useState, ReactNode } from 'react';
import { auth } from '../api/Config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { logOut, googleSignIn } from '../api/functions/useFirebase';

interface User {
  email: string;
  displayName: string;
  photoURL: string;
  uid: string;
}

interface AuthContextProps {
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({
  googleSignIn: async () => { },
  logOut: async () => { },
  user: null,
});

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };

  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext)
}
