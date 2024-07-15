
import { cms_end_point } from '../Endpoints/apiEndPoints';
import { others_api_end_points } from "../Endpoints/apiEndPoints";
import axiosInstance from 'axiosInstance';


export function fetch_cmsData(payload) {
  let _res = axiosInstance
    .get(`${cms_end_point.cms}/${payload}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
}

export function fetch_homepage_cmsData() {
  let _res = axiosInstance
    .get(`${cms_end_point.homepage}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
}

export function fetch_blog_cmsData(formData) {
  let _res = axiosInstance
    .post(`${cms_end_point.blog}`, formData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
}

export function fetch_partner_cmsData() {
  let _res = axiosInstance
    .get(`${cms_end_point.partner}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
}



export function fetch_product_categories_cmsData() {
  let _res = axiosInstance
    .get(`${cms_end_point.categories}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
}

export function fetch_service_homepage_cmsData() {
  let _res = axiosInstance
    .get(`${cms_end_point.service_homepage}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
}

export function fetch_testimonial_homepage_cmsData() {
  let _res = axiosInstance
    .get(`${cms_end_point.testimonial}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
}




// automatic logout after admin change status active to inactive or banned
export function ProfileDetailsQuery() {
  let _res = axiosInstance
    .get(`${others_api_end_points.getProfileDetails}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
}
