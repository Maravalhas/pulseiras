import { createContext, ReactNode, useState } from "react";

const defaultState = {
  loading: true,
  setAppLoading: (_: boolean) => {},
};

const LayoutContext = createContext(defaultState);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(defaultState.loading);

  function setAppLoading(value: boolean) {
    setLoading(value);
  }

  return (
    <LayoutContext.Provider
      value={{
        loading,
        setAppLoading,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
