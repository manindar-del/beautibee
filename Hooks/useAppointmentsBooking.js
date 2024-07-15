import { useQuery } from "react-query";
import axiosInstance from "axiosInstance";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";

export const useGetAllUserBookingList = (data) => {
  return useQuery(
    ["getAllUserBookingList", data?.pagination_page, data?.pagination_per_page],
    async () => {
      return axiosInstance
        .post(others_api_end_points.bookingAppList, data)
        .then(({ data }) => {
          return data;
        });
    }
  );
};


export const useGetAllProviderBookingList = (data) => {
  return useQuery(
    ["getAllProviderBookingList", data?.pagination_page, data?.pagination_per_page],
    async () => {
      return axiosInstance
        .post(others_api_end_points.providerBookingAppList, data)
        .then(({ data }) => {
          return data;
        });
    }
  );
};


export const providerBookingDate = () => {
  return useQuery(
    ["getAllProviderBookingDateList"],
    async () => {
      return axiosInstance
        .get(others_api_end_points.providerBookingDate,)
        .then(({ data }) => {
          return data;
        });
    }
  );
};

export const providerBookingDateDetails = async (date) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.providerBookingDateDetails}/${date}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};