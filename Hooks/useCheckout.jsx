import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { useRouter } from "next/router";

/**
 * It's a React hook that returns a function that makes a POST request to the server and then displays
 * a success message
 * @returns A function that takes a post object and returns a promise.
 */
export const useCheckoutPass = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.checkout, post)
        .then(({ data }) => {
          //enqueueSnackbar(data?.message, { variant: "success" });
          return data;
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getCheckout");
      },
    }
  );
};

/**
 * It returns a function that returns a function that returns a function that returns a function that
 *
 * returns a function that
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
 * `others_api_end_points.countrySelect` with the data passed to it
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
