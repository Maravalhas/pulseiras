import React from "react";
import { Navigate, createBrowserRouter, useLocation } from "react-router-dom";

const Redirect = () => {
  const location = useLocation().pathname;

  return (
    <Navigate
      to={location.length > 1 ? `/signin?link=${location}` : "/signin"}
    />
  );
};

const Public = createBrowserRouter([
  {
    path: "/signin",
    Component: React.lazy(() => import("../pages/Auth/Signin")),
  },
  {
    path: "*",
    element: <Redirect />,
  },
]);

export default Public;
