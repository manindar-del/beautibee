import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useQuery,
} from "react-query";
import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { useRouter } from "next/router";

/**
 * It returns a function that returns a function that returns a function that returns a function that
 * @returns The data is being returned.
 */
export const useTechnicianService = () => {
  return useInfiniteQuery("getTechnician", async () => {
    return axiosInstance
      .get(others_api_end_points.userTechnicianServiceExist, {})
      .then(({ data }) => {
        return data;
      });
  });
};

/**
 * It's a function that returns a promise that resolves to the response of an axios request
 * @param variables - The variables that you want to pass to the query.
 * @returns The response from the API call.
 */
export const useServiceTechnicianList = async (variables) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.userTechnicianListById}/${variables}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};


/**
 * It returns a query object that contains the data, loading, error, and refetch properties
 * @param data - This is the data that you want to pass to the API.
 */
export const useGetAllServiceProviderUserList = (data) => {
  return useQuery(
    [
      "getAllServiceProviderList",
      data?.pagination_page,
      data?.pagination_per_page,
      data?.badge_id,
    ],
    async () => {
      return axiosInstance
        .post(others_api_end_points.getTechnicianList, data)
        .then(({ data }) => {
          return data;
        });
    }
  );
};

/**
 * It returns a query object that contains the data, loading, error, and refetch properties
 * @param data - This is the data that you want to pass to the query.
 * @returns The data from the API call.
 */
export const useGetAllBadgeList = (data) => {
  return useQuery("getAllBadgeList", async () => {
    return axiosInstance
      .get(others_api_end_points.badgeList)
      .then(({ data }) => {
        return data;
      });
  });
};
