import axios from "axios";
import { ApiResponse } from "@/types";

export const fetchPosts = async (
  page: number,
  size: number,
  sort: string
): Promise<ApiResponse> => {
  const response = await axios.get("/api/ideas", {
    params: {
      "page[number]": page,
      "page[size]": size,
      "append[]": ["small_image", "medium_image"],
      sort,
    },
    headers: {
      Accept: "application/json",
    },
  });
  return response.data;
};
