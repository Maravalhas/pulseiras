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
