import axios from "axios";

export const getAllProducts = ({
  offset,
  limit,
  search,
  order,
  active,
}: {
  offset?: number;
  limit?: number;
  search?: string;
  order?: string[];
  active?: number[];
}) => {
  return axios.get("/products", {
    params: {
      offset,
      limit,
      search,
      order,
      active,
    },
  });
};

export const createProduct = (body: any) => {
  return axios.post("/products", body);
};

export const updateProduct = (id: number, body: any) => {
  return axios.put(`/products/${id}`, body);
};

export const deleteProduct = (id: number) => {
  return axios.delete(`/products/${id}`);
};
