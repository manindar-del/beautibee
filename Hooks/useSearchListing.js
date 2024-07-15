import { useMutation, useQuery, useQueryClient } from "react-query";
import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";

/**
 * It returns a query object that contains the data, loading, error, and refetch properties
 * @param data - This is the data that you want to pass to the API.
 */
export const useGetAllServiceSearchList = (data) => {
  return useQuery(
    [
      "getAllServiceSearchList",
      data?.pagination_page,
      data?.pagination_per_page,
      data?.longitude,
      data?.latitude,
      data?.rating,
      data?.price,
      data?.badge_id,
      data?.customer_id,
      data?.search_title,
      data?.maxDistance,
    ],
    async () => {
      return await axiosInstance 
        .post(others_api_end_points.serviceSearch, data)
        .then(({ data }) => {
          return data;
        });
    }
  );
};


export const useGetListServiceListingSubmit = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.serviceSearch, post)
        .then(({ data }) => {
          return data;
          
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getAllServiceListing");
      },
    }
  );
};




/**
 * It's a custom hook that returns a mutation function that makes a POST request to the server and then
 * refetches the query "getAllServiceList" on success
 * @returns A function that takes a post object and returns a promise.
 */
export const useCreateServiceAdd = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.createServiceBookingAdd, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "info" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getAllServiceList");
      },
    }
  );
};

/**
 * It returns a function that returns a promise that returns an object that returns an object
 * @param data - This is the data that you want to pass to the API.
 */
export const useGetAllServiceList = (data) => {
  return useQuery(["getAllServiceList", data?.provider_id], async () => {
    return axiosInstance
      .post(others_api_end_points.getAllServiceBookingList, data)
      .then(({ data }) => {
        return data;
      });
  });
};

/**
 * It's a custom hook that returns a mutation function that deletes a service booking list
 * @returns A function that takes a post object and returns a promise.
 */
export const useDeleteServiceBook = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.deleteServiceBookingList, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "info" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getAllServiceList");
      },
    }
  );
};

/**
 * It returns the result of a query that uses the `getAllTimeSlot` endpoint and the `provider_id` and
 * `booking_date` from the `data` object
 * @param data - The data object that will be passed to the API.
 */
export const useGetAllTimeSlot = (data) => {
  return useQuery(
    [
      "getAllTimeSlot",
      data?.provider_id,
      data?.booking_date,
      data?.daytime,
      data?.current_time,
      data?.today_date,
    ],
    async () => {
      return axiosInstance
        .post(others_api_end_points.getAllTimeSlot, data)
        .then(({ data }) => {
          return data;
        });
    }
  );
};

/**
 * It returns a function that makes a post request to the editBookingSlot endpoint, and then refetches
 * the getAllServiceList query
 * @returns A function that takes a post object and returns a promise.
 */
export const useEditBookingSlot = () => {
  const queryClient = useQueryClient();
  // const { enqueueSnackbar } = useSnackbar();
  return useMutation(
    async (post) => {
      return axiosInstance.post(others_api_end_points.editBookingSlot, post);
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getAllServiceList");
      },
    }
  );
};

/**
 * It's a custom hook that uses the useMutation hook from react-query to make a post request to the
 * bookingConfirm endpoint
 * @returns A function that takes a post object and returns a promise.
 */
export const useBookingConfirm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.bookingConfirm, post)
        .then(({ data }) => {
          //enqueueSnackbar(data?.message, { variant: "success" });
          return data
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        //queryClient.refetchQueries("getAllServiceSearchList");
        //queryClient.refetchQueries("getAllServiceList");
      },
    }
  );
};



/**
 * It returns a function that makes a post request to the server and returns the data
 * @returns A function that returns a function that returns a promise.
 */
export const useGetServiceListById = () => {
  return useMutation(async (post) => {
    return axiosInstance
      .post(others_api_end_points.serviceListing, post)
      .then(({ data }) => {
        return data;
      });
  });
};
