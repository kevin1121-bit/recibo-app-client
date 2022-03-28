import { createContext, useContext } from "react";
import { IResponseToken } from "../InterfaceGlobals/globalsInterface";
import useProvider from "./useProvider";

interface IAuthState {
  user: { username: string };
  token: string;
  isAuth: boolean;
}

export interface IAuth {
  authState: IAuthState;
  singIn: (response: IResponseToken) => void;
  singOut: () => void;
}

const AuthContext = createContext<IAuth | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function ProvicerAuth(props: any) {
  const auth: IAuth = useProvider();

  return (
    <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
  );
}
