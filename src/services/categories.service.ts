import { api } from "./api.service";

export const getCategories = async () => {
  const response = await api.get("/categories");
  console.log( "Categories response:", response );
  return response.data;
};
