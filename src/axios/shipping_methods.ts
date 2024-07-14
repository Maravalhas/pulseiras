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

export function createShippingMethod(data: any) {
  return axios.post("/shipping_methods", data);
}

export function updateShippingMethod(id: number, data: any) {
  return axios.put(`/shipping_methods/${id}`, data);
}
