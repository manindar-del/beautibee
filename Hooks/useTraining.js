import { useMutation, useQueryClient, useInfiniteQuery, useQuery } from "react-query";
import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { useRouter } from "next/router";

/**
 * It's a custom React Hook that uses the useMutation React Hook from React Query to make a POST
 * request to the server to create a new training
 * @returns A function that takes a post object and returns a promise.
 */
export const useCreateTraining = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.trainingAdd, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
          router.push("/service/training");
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getTraining");
      },
    }
  );
};

/**
 * It's a custom hook that returns a mutation function that updates a training
 * @returns A function that takes a post object and returns a promise.
 */
export const useUpdateTraining = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.trainingUpdate, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
          router.push("/service/training");
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getTraining");
      },
    }
  );
};

/**
 * It fetches data from the server and returns the data and a bunch of other stuff
 */
export const useGetAllTrainings = () => {
  return useInfiniteQuery(
    "getTraining",
    async ({ pageParam = 1 }) => {
      return axiosInstance
        .post(others_api_end_points.userWiseTrainingList, {
          training_type: "all",
          pagination_page: pageParam,
          pagination_per_page: 5,
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

/**
 * It fetches the training list from the server and returns the data, page number, and other
 * information
 */

// Training List  
export const useTrainingList = (data) => {
  return useQuery(
    [
      "getTrainingsList",
      data?.pagination_page,
      data?.pagination_per_page,
    ],
    async () => {
      return axiosInstance
        .post(others_api_end_points.trainingList, data)
        .then(({ data }) => {
          return data;
        });
    }
  );
};


/**
 * It makes a GET request to the server and returns the response
 * @param variables - The id of the training you want to get details for.
 */
export const GetTrainingDetails = async (variables) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.trainingDetails}/${variables}`)
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
 * It makes a GET request to the deleteTraining endpoint with the variables passed in as a parameter
 * @param variables - The id of the training you want to delete.
 * @returns The response from the API call.
 */
export const GetDeleteTraining = async (variables) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.deleteTraining}/${variables}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};
