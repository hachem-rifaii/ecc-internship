import apiClient from "./apiClient";

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};
type userData = {
  name : string;
  email: string;
  password: string;
}
export const register = async (userData: userData) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
