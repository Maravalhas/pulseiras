import { createContext, ReactNode, useState } from "react";

type User = {
  id: null | number;
  access_token: string;
  actions: {
    login: (id: number, access_token: string) => void;
    logout: () => void;
  };
};

const defaultState = {
  id: 1,
  access_token: "",
  actions: {
    login: (id: number, access_token: string) => {},
    logout: () => {},
  },
};

const UserContext = createContext<User>(defaultState);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: number | null; access_token: string }>(
    defaultState
  );

  function login(id: number, access_token: string) {
    setUser({
      id,
      access_token,
    });
  }

  function logout() {
    setUser({ id: null, access_token: "" });
  }

  return (
    <UserContext.Provider
      value={{
        ...user,
        actions: {
          login,
          logout,
        },
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
