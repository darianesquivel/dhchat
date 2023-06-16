import { useContext, createContext, useEffect, useState, ReactNode } from 'react';
import { auth, googleProvider } from '../api/Config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged} from 'firebase/auth';
import Cookies from 'universal-cookie'

interface User {
  email: string;
  displayName: string;
  photoURL:string;
}

  interface AuthContextProps {
  googleSignIn: () => Promise<void>;
  logOut: () => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({
  googleSignIn: async () => {},
  logOut: async () => {},
  user: null,
});

interface AuthContextProviderProps {
  children: ReactNode;
}
const cookies = new Cookies()

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);


  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      cookies.set('auth-token', result.user.refreshToken)
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      console.log({cookies})
      cookies.remove('auth-token')
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser:any) => {
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
