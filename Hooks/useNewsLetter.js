import { useMutation, useQuery, useQueryClient } from "react-query";
import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";

export const useNewsLetter = () => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();
    return useMutation(
      async (post) => {
        return axiosInstance
          .post(others_api_end_points.newsLetter, post)
          .then(({ data }) => {
            enqueueSnackbar(data?.message, { variant: "success" });
          })
          .catch(({ response }) => {
            enqueueSnackbar(response?.data?.message, { variant: "error" });
          });
      },
      {
        onSuccess: () => {
          queryClient.refetchQueries("newsLetter");
        },
      }
    );
  };