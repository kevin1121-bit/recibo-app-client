import { useReducer, useEffect } from "react";
import { IResponseToken } from "../InterfaceGlobals/globalsInterface";

const initialState = {
  user: { username: "" },
  token: "",
  isAuth: false,
};

type ActionType = {
  type: "IS_AUTH";
  payload: { token: string; isAuth: boolean; user: { username: string } };
};

const authReducer = (state: typeof initialState, action: ActionType) => {
  if (action.type === "IS_AUTH") {
    return {
      ...state,
      isAuth: action.payload.isAuth,
      token: action.payload.token,
      user: action.payload.user,
    };
  }
  return state;
};

function useProvider() {
  const [authState, dispatchAuth] = useReducer(authReducer, initialState);

  useEffect(() => {
    let existToken: string | null = localStorage.getItem("token");
    let userLocalStorage: string | null = localStorage.getItem("user");
    if (existToken && userLocalStorage) {
      dispatchAuth({
        type: "IS_AUTH",
        payload: {
          token: existToken,
          isAuth: true,
          user: JSON.parse(userLocalStorage),
        },
      });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatchAuth({
        type: "IS_AUTH",
        payload: { token: "", isAuth: false, user: { username: "" } },
      });
    }
    return () => {
      singOut();
      existToken = null;
      userLocalStorage = null;
    };
  }, []);

  const singIn = (response: IResponseToken) => {
    if (response.token && response.status) {
      const userObj = { username: response.username };
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(userObj));
      dispatchAuth({
        type: "IS_AUTH",
        payload: { token: response.token, isAuth: true, user: userObj },
      });
    }
  };

  const singOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatchAuth({
      type: "IS_AUTH",
      payload: { token: "", isAuth: false, user: { username: "" } },
    });
  };

  return {
    authState,
    singOut,
    singIn,
  };
}

export default useProvider;
