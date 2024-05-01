import {
  Navigate,
  createBrowserRouter,
  useSearchParams,
} from "react-router-dom";
import React from "react";
import Layout from "../components/layout/Layout";
import Error404 from "../pages/Error404/Error404";

const Redirect = () => {
  const [search] = useSearchParams();

  return <Navigate to={search.get("link") || "/home"} />;
};

const PrivateRoute = ({ Children }: any) => {
  if (true) {
    return Children;
  }
  return <Error404 />;
};

const Private = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/home",
        Component: React.lazy(() => import("../pages/Home/Home")),
      },
      {
        path: "/signin",
        element: <Redirect />,
      },
      {
        path: "*",
        element: <Error404 />,
      },
    ],
  },
]);

export default Private;
