import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { useRouter } from "next/router";
import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";

/**
 * It makes a GET request to the server and returns the response
 * @param variables - The id of the subscription you want to get details for.
 */

export const GetSubscriptionPlan = () => {
  return useInfiniteQuery("getSubscriptionPlan", async () => {
    return axiosInstance
      .get(others_api_end_points.subscriptionPlan, {})
      .then(({ data }) => {
        return data;
      });
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.subscriptionNew, post)
        .then(({ data }) => {
          //enqueueSnackbar(data?.message, { variant: "success" });
          //router.push("/service/dashboard");
          return data;
        });
        
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("subscriptionAdd");
      },
    }
  );
};

export const useSwitchPlan = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.subscriptionSwitchPlan, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
          //router.push("/service/dashboard");
          return data;
        });
        
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("switchPlan");
      },
    }
  );
};



export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  return useMutation(
    async (get) => {
      return axiosInstance
        .get(others_api_end_points.cancelSubscription, get)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
        });
        
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("subscriptionCancel");
      },
    }
  );
};


// Free Subscription plan
export const useNewSubscription = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.freeSubscription, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
          router.push("/service/dashboard");
        });
        
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("subscriptionFree");
      },
    }
  );
};


