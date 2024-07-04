import axios from "axios";

export const getAllOrders = ({
  offset,
  limit,
  search,
  order,
}: {
  offset: number;
  limit: number;
  search: string;
  order: string[];
}) => {
  return axios.get("/orders", {
    params: {
      offset,
      limit,
      search,
      order,
    },
  });
};

export const getOrderById = (id: number) => {
  return axios.get(`/orders/${id}`);
};

export const createOrder = (body: any) => {
  return axios.post("/orders", body);
};
