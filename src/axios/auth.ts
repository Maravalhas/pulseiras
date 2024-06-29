import axios from "axios";

export const getUserByToken = (token: string) => {
  return axios.get("/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const signin = (username: string, password: string) => {
  return axios.post("/auth", { username, password });
};
