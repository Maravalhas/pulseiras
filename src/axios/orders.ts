import axios from "axios";

export const getAllOrders = ({
  offset,
  limit,
  search,
  order,
  products,
  date,
  state,
}: {
  offset?: number;
  limit?: number;
  search?: string;
  order?: string[];
  products?: number;
  date?: string;
  state?: number;
}) => {
  return axios.get("/orders", {
    params: {
      offset,
      limit,
      search,
      order,
      products,
      date,
      state,
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

export const patchOrderState = (id: number) => {
  return axios.patch(`/orders/${id}`);
};

export const deleteOrder = (id: number) => {
  return axios.delete(`/orders/${id}`);
};
