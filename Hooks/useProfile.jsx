import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { useRouter } from "next/router";
import { Cookies } from "react-cookie";
/**
 * It returns a function that returns a function that returns a function that returns a function that
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

export const useProfileDetails = () => {
  return useMutation("useProfileDetails", async (get) => {
    return axiosInstance
      .get(others_api_end_points.getProfileDetails, get)
      .then(({ data }) => {
        return data;
      });
  });
};

export const switchUserAccount = () => {
  // const queryClient = useQueryClient();
  const cookie = new Cookies();
  return useMutation(async (post) => {
    return axiosInstance
      .post(others_api_end_points.changeRole, post)
      .then(({ data }) => {
        cookie.set("userchnagess", data?.data?.user_type);
        return data?.data?.user_type;
      });
  });
};
