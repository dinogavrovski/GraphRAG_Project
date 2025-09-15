import { SearchResponse } from "@/types/car";
import {api} from "@/lib/axios.ts";

export const searchCars = async (query: string): Promise<SearchResponse> => {
  const response = await api.post<SearchResponse>("/search", { query })
  console.log(response)
  return response.data
};