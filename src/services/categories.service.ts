import { api } from "./api.service";

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};
