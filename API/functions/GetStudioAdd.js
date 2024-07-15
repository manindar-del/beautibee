
import { others_api_end_points } from "../Endpoints/apiEndPoints";
import axiosInstance from "axiosInstance";

export const GetStudioAdd = async (variables) => {
    let _res = axiosInstance
      .post(others_api_end_points.studioAdd, variables)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  
    return _res;
  };
  
  export const GetStudioList = async (variables) => {
    let _res = axiosInstance
      .post(others_api_end_points.studioList, variables)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  
    return _res;
  };
  
  
  export const GetStudioDetails = async (variables) => {
    let _res = axiosInstance
      .get(`${others_api_end_points.studioDetails}/${variables}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return error;
      });
  
    return _res;
  };
  
  