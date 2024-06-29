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
        path: "/products/list",
        Component: React.lazy(() => import("../pages/Products/List")),
      },
      {
        path: "/products/list/:id",
        Component: React.lazy(() => import("../pages/Products/Detail")),
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
