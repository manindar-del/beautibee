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
 * It's a custom hook that returns a mutation function that creates a studio
 * @returns A function that takes a post object and returns a promise.
 */
export const useCreateStudio = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.studioAdd, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
          router.push("/service/studio");
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getStudio");
      },
    }
  );
};

/**
 * It's a custom hook that returns a mutation function that updates a studio
 * @returns A function that takes a post object and returns a promise.
 */
export const useUpdateStudio = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.studioUpdate, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
          router.push("/service/studio");
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getStudio");
      },
    }
  );
};

/**
 * It returns an object with the following properties:
 *
 * - `data`: The data returned by the API.
 * - `status`: The status of the request.
 * - `error`: The error if any.
 * - `isFetching`: Whether the request is currently being made.
 * - `isFetchingMore`: Whether the request for the next page is currently being made.
 * - `isFetchingPrevious`: Whether the request for the previous page is currently being made.
 * - `isFetchingFirst`: Whether the request for the first page is currently being made.
 * - `isFetchingLast`: Whether the request for the last page is currently being made.
 * - `isFetchingAll`: Whether the request for all pages is currently being made.
 * - `isRefetching`: Whether the request is currently being refetched.
 * - `isPolling
 * @param categoryId - This is the category id of the studio.
 */
export const useGetAllstudios = (categoryId) => {
  return useInfiniteQuery(
    ["getStudio", categoryId],
    async ({ pageParam = 1 }) => {
      return axiosInstance
        .post(others_api_end_points.userWiseStudioList, {
          category_id: categoryId,
          pagination_page: pageParam,
          pagination_per_page: 5,
        })
        .then(({ data }) => {
          return data;
        });
    },
    {
      keepPreviousData: true,

      // refetchInterval: 1000 * 10,
      getNextPageParam: (lastPage) => {
        return lastPage?.data?.length >= 5 ? lastPage?.page + 1 : undefined;
      },
    }
  );
};

/**
 * It returns an object with the following properties:
 *
 * - `data`: The data returned from the API.
 * - `isFetching`: Whether the request is currently in flight.
 * - `isFetchingMore`: Whether the request is currently in flight.
 * - `isLoading`: Whether the request is currently in flight.
 * - `isLoadingMore`: Whether the request is currently in flight.
 * - `isError`: Whether the request errored.
 * - `error`: The error returned from the API.
 * - `isSuccess`: Whether the request was successful.
 * - `isIdle`: Whether the request is neither in flight nor errored.
 * - `isRefetching`: Whether the request is currently in flight.
 * - `canFetchMore`: Whether there is more data to fetch.
 * - `refetch`: A function to refetch the data.
 * @returns The return value is an object with the following properties:
 */
export const useGetAllCountry = () => {
  return useInfiniteQuery("getCountry", async () => {
    return axiosInstance
      .post(others_api_end_points.countrySelect, {
        location_type: "country",
      })
      .then(({ data }) => {
        return data;
      });
  });
};

/**
 * It returns a function that makes a post request to the endpoint
 * `others_api_end_points.countrySelect` and returns the data
 * @returns A function that returns a promise.
 */
export const useGetAllStateMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      return axiosInstance
        .post(others_api_end_points.countrySelect, data)
        .then(({ data }) => {
          return data;
        });
    },
  });
};

/**
 * It's a function that makes a GET request to the server and returns the response
 * @param variables - The id of the studio you want to get details for.
 * @returns The response from the API call.
 */
export const GetStudioDetails = async (variables) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.studioDetails}/${variables}`)
    .then((response) => {
      if (response.status == 200) {
        return response.data;
      } else return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};

/**
 * It returns a function that returns a function that returns a function that returns a function that
 * @returns The return value is an object with the following properties:
 */
export const useGetCategoryStudio = () => {
  return useInfiniteQuery("getCategory", async () => {
    return axiosInstance
      .get(others_api_end_points.studioCategory)
      .then(({ data }) => {
        return data;
      });
  });
};

/**
 * It makes a GET request to the deleteStudio endpoint with the id of the studio to be deleted
 * @param variables - The id of the studio you want to delete.
 * @returns The response from the API call.
 */
export const GetDeleteStudio = async (variables) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.deleteStudio}/${variables}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};

/**
 * It returns the result of a query that fetches data from the server using the `axiosInstance` and
 * returns the data
 * @param data - This is the data that you want to pass to the API.
 * @returns The data is being returned.
 */
export const useGetAllStudioUserList = (data) => {
  return useQuery(
    [
      "getAllStudioUserList",
      data?.pagination_page,
      data?.pagination_per_page,
      data?.category_id,
    ],
    async () => {
      return axiosInstance
        .post(others_api_end_points.studioList, data)
        .then(({ data }) => {
          return data;
        });
    }
  );
};

/**
 * It returns a query object that contains the data, loading, error, and refetch properties
 * @param data - This is the data that you want to pass to the query.
 * @returns The data is being returned.
 */
export const useGetAllStudioCategoryList = (data) => {
  return useQuery("getAllStudioCategoryList", async () => {
    return axiosInstance
      .get(others_api_end_points.studioCategory)
      .then(({ data }) => {
        return data;
      });
  });
};
