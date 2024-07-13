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

const Private = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" />,
      },
      {
        path: "/home",
        Component: React.lazy(() => import("../pages/Home/Home")),
      },
      {
        path: "/orders/list",
        Component: React.lazy(() => import("../pages/Orders/List")),
      },
      {
        path: "/orders/list/:id",
        Component: React.lazy(() => import("../pages/Orders/Detail")),
      },
      {
        path: "/maintenance",
        Component: React.lazy(() => import("../pages/Maintenance/Maintenance")),
      },
      {
        path: "/maintenance/:id",
        Component: React.lazy(() => import("../pages/Maintenance/Maintenance")),
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
