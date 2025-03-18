import apiClient from "./apiClient";

export const getProducts = async () => {
  const response = await apiClient.get("/product");
  return response.data.products;
};
