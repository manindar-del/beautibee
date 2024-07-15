import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { useRouter } from "next/router";

/**
 * It returns a mutation function that makes a post request to the server and on success, it refetches
 * the query "provider"
 * @returns A function that returns a function that returns a function.
 */
export const userTecnicianFavotites = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (payload) => {
      return axiosInstance
        .post(others_api_end_points.userTechnicianFavourite, payload)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
        });
    },
    {
      onSuccess: () => {
        // queryClient.refetchQueries("getUserTechnicianFavorite");
        queryClient.refetchQueries("provider");
      },
    }
  );
};

/**
 * It makes a POST request to the endpoint `others_api_end_points.getTechnicianDetails` with the data
 * passed to it as a parameter
 * @param data - The data object that you want to send to the server.
 * @returns The response from the API call.
 */
export const fetchGetTechnicianList = async (data) => {
  let _res = await axiosInstance
    .post(others_api_end_points.getTechnicianDetails, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};
