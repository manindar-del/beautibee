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
 * It returns a function that creates a service
 * @returns A function that takes a post object and returns a promise.
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.serviceAdd, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
           router.push("/service/service");
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getService");
      },
    }
  );
};
/**
 * It returns a mutation function that updates a service
 * @returns A function that takes a post object and returns a promise.
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.serviceUpdate, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
           router.push("/service/service");
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getUpdate");
      },
    }
  );
};

/**
 * It fetches the data from the API and returns the data in the form of an object
 */
// service Provider details customer end
export const useGetAllServices = (categoryId, userId, maxDistances, latitudes, longitudes) => {
  return useInfiniteQuery(
    ["getService", categoryId, userId, maxDistances, latitudes, longitudes],
    async ({ pageParam = 1 }) => {
      return axiosInstance
        .post(others_api_end_points.serviceListing, {
          category_id: categoryId,
          user_id: userId,
          pagination_page: pageParam,
          pagination_per_page: 5,
          maxDistance: maxDistances,
          latitude:latitudes,
          longitude: longitudes
        })
        .then(({ data }) => {
          return data;
        });
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => {
        return lastPage?.data?.length >= 5 ? lastPage?.page + 1 : undefined;
      },
    }
  );
};

/**
 * It fetches the data from the API and returns the data in the form of an object
 */

// Service list technician end
export const useServicesList = (categoryId, userId) => {
  return useInfiniteQuery(
    ["getServiceList", categoryId, userId],
    async ({ pageParam = 1 }) => {
      return axiosInstance
        .post(others_api_end_points.technicianServiceList, {
          category_id: categoryId,
          user_id: userId,
          pagination_page: pageParam,
          pagination_per_page: 5,
        
        })
        .then(({ data }) => {
          return data;
        });
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => {
        return lastPage?.data?.length >= 5 ? lastPage?.page + 1 : undefined;
        //return lastPage?.page <= lastPage?.pages ? lastPage?.page+1: null;
      },
    }
  );
};

/**
 * It returns a function that returns a function that returns a function that returns a function that
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
 * It returns a function that makes a post request to the endpoint and returns the data
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
 * It returns an object with the following properties:
 *
 * - `data`: The data returned by the API.
 * - `status`: The status of the query.
 * - `isFetching`: Whether the query is currently being fetched.
 * - `isFetchingMore`: Whether more data is being fetched.
 * @returns The return value is an object with the following properties:
 */
export const useGetExperience = () => {
  return useInfiniteQuery("getExperience", async ({ pageParam = 1 }) => {
    return axiosInstance
      .get(others_api_end_points.exprienceList)
      .then(({ data }) => {
        return data;
      });
  });
};

/**
 * It returns a function that returns a function that returns a function that returns a function that
 * @returns The return value is an object with the following properties:
 */
export const useGetServiceCategory = () => {
  return useInfiniteQuery("getServiceCategory", async ({ pageParam = 1 }) => {
    return axiosInstance
      .get(others_api_end_points.serviceCategory)
      .then(({ data }) => {
        return data;
      });
  });
};

/**
 * It returns a function that returns a function that returns a function that returns a function that
 * @returns the useInfiniteQuery hook.
 */
export const useGetBadgeList = () => {
  return useInfiniteQuery("getBadge", async ({ pageParam = 1 }) => {
    return axiosInstance
      .get(others_api_end_points.badgeList)
      .then(({ data }) => {
        return data;
      });
  });
};

/**
 * It makes a GET request to the server and returns the response
 */
export const GetServiceDetails = async (variables) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.serviceDetails}/${variables}`)
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
 * It's a React hook that uses the useMutation hook from React Query to make a POST request to the
 * deleteService endpoint
 * @returns A function that takes a post object and returns a promise.
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.deleteService, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getDeleteService");
      },
    }
  );
};
