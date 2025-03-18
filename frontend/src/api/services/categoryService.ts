import apiClient from "./apiClient";

export const getCategories = async () => {
  const response = await apiClient.get("/category");
  return response.data.data;
};
