import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { useRouter } from "next/router";


export const useChangeProviderBookingStatus = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation(
      async (post) => {
        return axiosInstance
          .post(others_api_end_points.bookingProviderStatus, post)
          .then(({ data }) => {
            enqueueSnackbar(data?.message, { variant: "success" });
          })
          .catch(({ response }) => {
            enqueueSnackbar(response?.data?.message, { variant: "error" });
          });
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("Bookingist");
        },
      }
    );
  };
