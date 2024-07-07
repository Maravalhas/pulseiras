import axios from "axios";

export const getAllOrders = ({
  offset,
  limit,
  search,
  order,
  products,
  date,
}: {
  offset?: number;
  limit?: number;
  search?: string;
  order?: string[];
  products?: number;
  date?: string;
}) => {
  return axios.get("/orders", {
    params: {
      offset,
      limit,
      search,
      order,
      products,
      date,
    },
  });
};

export const getOrderById = (id: number) => {
  return axios.get(`/orders/${id}`);
};

export const createOrder = (body: any) => {
  return axios.post("/orders", body);
};

export const updateOrder = (id: number, body: any) => {
  return axios.put(`/orders/${id}`, body);
};
