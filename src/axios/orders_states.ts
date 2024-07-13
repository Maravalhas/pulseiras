import axios from "axios";

export function getAllOrdersStates() {
  return axios.get("/orders/states");
}
