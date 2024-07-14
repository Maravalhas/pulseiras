import axios from "axios";

export const getAllProductsCategories = ({
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
  return axios.get("/products/categories", {
    params: {
      offset,
      limit,
      search,
      order,
      active,
    },
  });
};

export const createProductsCategories = (body: any) => {
  return axios.post("/products/categories", body);
};

export const updateProductsCategories = (id: number, body: any) => {
  return axios.put(`/products/categories/${id}`, body);
};
