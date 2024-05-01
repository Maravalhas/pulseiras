import { RouterProvider } from "react-router-dom";

import Public from "./routes/Public";
import Private from "./routes/Private";
import { useContext } from "react";
import UserContext from "./store/User";

function App() {
  const user = useContext(UserContext);

  return <RouterProvider router={user.id ? Private : Public} />;
}

export default App;
