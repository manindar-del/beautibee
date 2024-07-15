import {
    useQuery,
  } from "react-query";
  import axiosInstance from "axiosInstance";
  import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";




export const useGetAllSocialSetting = () => {
    return useQuery("getAllSocialSetting", async () => {
      return axiosInstance
        .get(others_api_end_points.socialSetting)
        .then(({ data }) => {
          return data;
        });
    });
  };