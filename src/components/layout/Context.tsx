import { createContext, ReactNode, useState } from "react";
import { ToastContainer } from "react-toastify";

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
      <ToastContainer autoClose={5000} closeOnClick theme="colored" />
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
