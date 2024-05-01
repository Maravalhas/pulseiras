import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import "./assets/scss/index.scss";
import { UserProvider } from "./store/User.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <App />
  </UserProvider>
);
