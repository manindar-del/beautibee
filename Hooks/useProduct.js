import { useQuery } from "react-query";
import axiosInstance from "axiosInstance";

import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";

/**
 * It returns the result of a query that is made up of the string "getAllProductList" and the values of
 * the data object's pagination_page, pagination_per_page, category_id, and search properties
 * @param data - This is the data that you want to pass to the API.
 */
export const useGetAllProductUserList = (data) => {
  return useQuery(
    [
      "getAllProductList",
      data?.pagination_page,
      data?.pagination_per_page,
      data?.category_id,
      data?.search,
    ],
    async () => {
      return axiosInstance
        .post(others_api_end_points.productList, data)
        .then(({ data }) => {
          return data;
        });
    }
  );
};
