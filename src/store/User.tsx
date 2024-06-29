import { createContext, ReactNode, useState } from "react";
import axios from "axios";

type User = {
  access_token: string;
  id: null | number;
  name: string | null;
  actions: {
    login: ({ access_token }: { access_token: string }) => void;
    logout: () => void;
    saveInfo: (info: { id: number; name: string }) => void;
  };
};

const defaultState = {
  id: null,
  access_token: "",
  name: "",
  actions: {
    login: (_: { access_token: string }) => {},
    logout: () => {},
    saveInfo: (_: { id: number; name: string }) => {},
  },
};

const UserContext = createContext<User>(defaultState);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string>("");

  const [user, setUser] = useState<{
    id: number | null;
    name: string | null;
  }>(defaultState);

  function login({ access_token }: { access_token: string }) {
    setAccessToken(access_token);
  }

  function logout() {
    axios.defaults.headers.common["Authorization"] = "";
    setAccessToken("");
    setUser({ id: null, name: "" });
  }

  function saveInfo(info: { id: number; name: string }) {
    setUser(info);
  }

  return (
    <UserContext.Provider
      value={{
        ...user,
        access_token: accessToken,
        actions: {
          login,
          logout,
          saveInfo,
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
