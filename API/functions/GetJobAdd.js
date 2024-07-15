import { others_api_end_points } from "../Endpoints/apiEndPoints";
import axiosInstance from "axiosInstance";

export const GetJobAdd = async (variables) => {
  let _res = axiosInstance
    .post(others_api_end_points.jobAdd, variables)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};

export const GetJobList = async (variables) => {
  let _res = axiosInstance
    .post(others_api_end_points.getAllJobsList, variables)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};

export const GetJobCategories = async () => {
  let _res = axiosInstance
    .get(others_api_end_points.job_categories)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};
