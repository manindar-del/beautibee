import { others_api_end_points } from "../Endpoints/apiEndPoints";
import axiosInstance from "axiosInstance";

export const GetTrainingAdd = async (variables) => {
  let _res = axiosInstance
    .post(others_api_end_points.trainingAdd, variables)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};




export const GetTrainingList = async (variables) => {
  let _res = axiosInstance
    .post(others_api_end_points.trainingList, variables)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};


export const GetTrainingDetails = async (variables) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.trainingDetails}/${variables}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};



