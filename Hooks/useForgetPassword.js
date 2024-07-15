import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { useRouter } from "next/router";

/**
 * It's a custom hook that returns a mutation function that sends a post request to the server and then
 * refetches the query "getForgetPassword" on success
 * @returns A function that takes a post object and returns a promise.
 */

export const useForgetPassword = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.forgetPassword, post)
        .then(({ data }) => {
           enqueueSnackbar(data?.message, { variant: "success" });
           router.push("/forgot-password");
           return data;
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getForgetPassword");
      },
    }
  );
};

// Verify with email and otp

export const useForgetVerify = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.verifyEmail, post)
        .then(({ data }) => {
           enqueueSnackbar(data?.message, { variant: "success" });
           
           router.push("/reset-password");
           return data;

        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getForgetVerify");
      },
    }
  );
};


// Reset Password

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.resetPassword, post)
        .then(({ data }) => {
           enqueueSnackbar(data?.message, { variant: "success" });
           
           router.push("/login");

        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("getResetPassword");
      },
    }
  );
};
