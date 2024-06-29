import ReactDOM from "react-dom/client";
import axios from "axios";

import App from "./App.tsx";

import { UserProvider } from "./store/User.tsx";
import { LayoutProvider } from "./components/layout/Context.tsx";

import "./assets/scss/index.scss";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <LayoutProvider>
      <App />
    </LayoutProvider>
  </UserProvider>
);
