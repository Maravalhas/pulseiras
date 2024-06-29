import axios from "axios";

export const getAllProducts = ({
  offset,
  limit,
  search,
  order,
}: {
  offset?: number;
  limit?: number;
  search?: string;
  order?: string[];
}) => {
  return axios.get("/products", {
    params: {
      offset,
      limit,
      search,
      order,
    },
  });
};

export const createProduct = (body: any) => {
  return axios.post("/products", body);
};

export const getAllProcuctsCategories = ({
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
