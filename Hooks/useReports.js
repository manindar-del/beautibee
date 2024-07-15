import axiosInstance from "axiosInstance";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { useInfiniteQuery, useQuery } from "react-query";

export const useReportList = (data) => {
  return useQuery(
    ["getReportList", 
    data?.service_id, 
    data?.start_date, 
    data?.end_date
  ],
    async () => {
      return axiosInstance
        .post(others_api_end_points.report, data)
        .then(({ data }) => {
          return data;
        });
    }
  );
};



export const useCountReportList = (data) => {
  return useQuery(
    ["getCountReportList", 
    data?.service_id, 
    data?.start_date, 
    data?.end_date
  ],
    async () => {
      return axiosInstance
        .post(others_api_end_points.countReport, data)
        .then(({ data }) => {
          return data;
        });
    }
  );
};