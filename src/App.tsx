import { RouterProvider } from "react-router-dom";
import { useContext, useEffect } from "react";
import axios from "axios";

import Public from "./routes/Public";
import Private from "./routes/Private";

import UserContext from "./store/User";
import LayoutContext from "./components/layout/Context";
import Loading from "./components/Loading/Loading";
import { getUserByToken } from "./axios/auth";

function App() {
  const user = useContext(UserContext);
  const layout = useContext(LayoutContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      layout.setAppLoading(false);
    } else {
      user.actions.login({ access_token: token });
    }
  }, []);

  useEffect(() => {
    if (user.access_token && !user.id) {
      if (layout.loading) {
        layout.setAppLoading(true);
      }

      getUserByToken(user.access_token)
        .then((res) => {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${user.access_token}`;
          user.actions.saveInfo(res.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          user.actions.logout();
        });
    }
  }, [user.access_token]);

  useEffect(() => {
    if (user.id) {
      if (layout.loading) {
        layout.setAppLoading(false);
      }
    }
  }, [user.id]);

  return (
    <>
      {layout.loading ? (
        <Loading />
      ) : (
        <RouterProvider router={user.id ? Private : Public} />
      )}
    </>
  );
}

export default App;
