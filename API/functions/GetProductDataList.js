import { api_end_points } from "../Endpoints/apiEndPoints";
import axiosInstance from "axiosInstance";
export const GetProductDataList = async () => {
  let _res = axiosInstance
    .get(api_end_points.products)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};

export default GetProductDataList;
