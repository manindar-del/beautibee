import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { useRouter } from "next/router";

/**
 * It fetches the order list from the server and returns the data
 */
export const useGetAllOrderList = (data) => {
  return useInfiniteQuery(
    ["orderList", data?.status],
    async ({ pageParam = 1 }) => {
      return axiosInstance
        .post(others_api_end_points.orderList, {
          pagination_page: pageParam,
          pagination_per_page: 5,
          provider_status: data.status,
        })
        .then(({ data }) => {
          return data;
        });
    },
    {
      keepPreviousData: true,

      //refetchInterval: 1000 * 10,
      getNextPageParam: (lastPage) => {
        console.log(lastPage,"lastPage")
        return lastPage?.data?.length >= 5 ? lastPage?.page + 1 : undefined;
      },
    }
  );
};

/**
 * It fetches the  user order list from the server and returns the data
 */
export const useGetUserAllOrderList = (data) => {
  return useInfiniteQuery(
    ["orderUserList", data?.status],
    async ({ pageParam = 1 }) => {
      return axiosInstance
        .post(others_api_end_points.orderUserList, {
          pagination_page: pageParam,
          pagination_per_page: 5,
          provider_status: data?.status,
        })
        .then(({ data }) => {
          return data;
        });
    },
    {
      keepPreviousData: true,

      //refetchInterval: 1000 * 10,
      getNextPageParam: (lastPage) => {
        return lastPage?.data?.length >= 5 ? lastPage?.page + 1 : undefined;
      },
    }
  );
};

export const useChangeOrderStatus = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.changeOrderStatus, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("orderList");
      },
    }
  );
};
