import { createContext, useState } from 'react';
import type { SetStateAction, ReactNode, Dispatch } from 'react';


interface IUser {
  email: string;
  name: string;
}

interface IAuthState {
  isAuthenticated: boolean;
  user: IUser;
}

interface IAuthContext {
  auth: IAuthState;
  setAuth: Dispatch<SetStateAction<IAuthState>>;
  appLoading: boolean;
  setAppLoading: Dispatch<SetStateAction<boolean>>;
}



const defaultContextValue: IAuthContext = {
  auth: {
    isAuthenticated: false,
    user: { email: "", name: "" },
  },
  setAuth: () => {},
  appLoading: true,
  setAppLoading: () => {},
};


const AuthContext = createContext<IAuthContext>(defaultContextValue);

export { AuthContext };


export const AuthWrapper = (props: { children: ReactNode }) => {
  
  const [auth, setAuth] = useState<IAuthState>({
    isAuthenticated: false,
    user: {
      email: "",
      name: "",
    },
  });

  const [appLoading, setAppLoading] = useState<boolean>(true);

  return (
    <AuthContext.Provider value={{
      auth, setAuth, appLoading, setAppLoading
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}