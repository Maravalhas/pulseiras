import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import { Container } from "react-bootstrap";

import Topbar from "./Topbar";
import Aside from "./Aside";

const Layout = () => {
  return (
    <>
      <Aside />
      <div id="main">
        <Topbar />
        <div id="post">
          <Suspense fallback={<p>Loading...</p>}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default Layout;
