import axiosInstance from "axiosInstance";

export const GetMapAutoComplete = async (data) => {
  let _res = axiosInstance
    .get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${value},${country_code},&key=AIzaSyCSswYVKOUhmYxS_AzPROhWKOmgcAYDsnA`
    )
    .then((response) => {
        console.log(response,"response");
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};
