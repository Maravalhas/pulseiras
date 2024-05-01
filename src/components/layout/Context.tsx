import { createContext, ReactNode } from "react";

const defaultState = {};

const LayoutContext = createContext(defaultState);

export const LayoutProvider = (children: ReactNode) => {
  return (
    <LayoutContext.Provider value={defaultState}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
