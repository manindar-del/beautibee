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
 * It creates a new job and then refetches the getAllJobs query
 * @returns A function that takes a post object and returns a promise.
 */
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.jobCreate, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
          router.push("/service/jobs");
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getAllJobs");
      },
    }
  );
};

/**
 * It's a custom hook that returns a mutation function that updates a job
 * @returns A function that takes a post object and returns a promise.
 */
export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.jobUpdate, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
          router.push("/service/jobs");
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("updateJobs");
      },
    }
  );
};

/**
 * It returns the result of a query that fetches the list of job applications
 * @param data - This is the data that you want to pass to the API.
 */
export const useGetApplyList = (data) => {
  return useQuery(
    [
      "getAllApplyList",
      data?.pagination_page,
      data?.pagination_per_page,
      data?.job_id,
    ],
    async () => {
      return axiosInstance
        .post(others_api_end_points.jobApplyList, data)
        .then(({ data }) => {
          return data;
        });
    }
  );
};

/**
 * It fetches data from the server and returns the data and a bunch of other stuff
 */
export const useGetAllJobs = () => {
  return useInfiniteQuery(
    "getAllJobs",
    async ({ pageParam = 1 }) => {
      return axiosInstance
        .post(others_api_end_points.userWiseJobList, {
          pagination_page: pageParam,
          pagination_per_page: 5,
        })
        .then(({ data }) => {
          return data;
        });
    },
    {
      keepPreviousData: true,
      //  enabled: Boolean(id),
      refetchInterval: 1000 * 10,
      getNextPageParam: (lastPage) => {
        return lastPage?.data?.length >= 5 ? lastPage?.page + 1 : undefined;
      },
    }
  );
};

/**
 * It returns an object with the following properties:
 *
 * - `data`: The data returned by the API.
 * - `isFetching`: Whether the request is currently in flight.
 * - `isFetchingMore`: Whether the request is currently in flight.
 * - `isLoading`: Whether the request is currently in flight.
 * - `isError`: Whether the request is currently in flight.
 * - `error`: The error returned by the API, if any.
 * - `canFetchMore`: Whether there is more data to fetch.
 * - `fetchMore`: A function to fetch more data.
 * - `refetch`: A function to refetch the data.
 * - `reset`: A function to reset the data
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
 * It returns a function that fetches data from the API and returns the data
 * @returns The useInfiniteQuery hook returns an object with the following properties:
 */
export const useGetCategory = () => {
  return useInfiniteQuery(
    "getCategory",
    async ({ pageParam = 1 }) => {
      return axiosInstance
        .get(others_api_end_points.job_categories)
        .then(({ data }) => {
          return data;
        });
    }
    //  {
    //    keepPreviousData: true,
    //   //  enabled: Boolean(id),
    //    refetchInterval: 1000 * 10,
    //    getNextPageParam: (lastPage) => {
    //      return lastPage?.data?.docs?.length >= 5
    //        ? lastPage?.data?.page + 1
    //        : undefined;
    //    },
    //  }
  );
};

/**
 * It makes a GET request to the endpoint `/api/v1/jobs/:jobId` and returns the response
 * @param variables - The id of the job you want to get details for.
 */
export const GetJobDetails = async (variables) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.getJobDetails}/${variables}`)
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
 * It's a function that makes a GET request to the API endpoint `/api/v1/jobs/delete/:id` and returns
 * the response
 * @param variables - The variables that you want to pass to the API.
 * @returns The response from the API call.
 */
export const GetDeleteJob = async (variables) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.deleteJob}/${variables}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};

export const useGetAllJobApplyList = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.userApplyList, post)
        .then(({ data }) => {
          return data;
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getUserApplyAllJobs");
      },
    }
  );
};
