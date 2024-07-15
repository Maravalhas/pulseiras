import { Outlet } from "react-router-dom";
import { Suspense } from "react";

import Topbar from "./Topbar";
import Aside from "./Aside";
import BottomNavigation from "./BottomNavigation";

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
        <BottomNavigation />
      </div>
    </>
  );
};

export default Layout;
