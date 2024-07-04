import axios from "axios";

export function getAllShippingMethods({
  offset,
  limit,
  search,
  order,
}: {
  offset?: number;
  limit?: number;
  search?: string;
  order?: string[];
}) {
  return axios.get("/shipping_methods", {
    params: { offset, limit, search, order },
  });
}
