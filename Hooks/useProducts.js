import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import axiosInstance from "axiosInstance";
import { useSnackbar } from "notistack";
import { others_api_end_points } from "@/api/Endpoints/apiEndPoints";
import { useRouter } from "next/router";

/**
 * It's a React hook that returns a function that creates a product
 * @returns A function that takes a post object and returns a promise.
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.productAdd, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
          router.push("/service/product");
        })
        .catch(({ response }) => {
          enqueueSnackbar(response?.data?.message, { variant: "error" });
        });
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("productShowCreate");
      },
    }
  );
};

/**
 * It's a custom hook that returns a mutation function that updates a product
 * @returns A function that takes a post object and returns a promise.
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  return useMutation(
    async (post) => {
      return axiosInstance
        .post(others_api_end_points.productUpdate, post)
        .then(({ data }) => {
          enqueueSnackbar(data?.message, { variant: "success" });
          router.push("/service/product");
        })
    },
    {
      onSuccess: () => {
        queryClient.refetchQueries("product_shows");
      },
    }
  );
};

/**
 * It fetches data from the server and returns the data and a bunch of other stuff
 * @param selectCategory - This is the category id that is selected by the user.
 * @param searchValue - This is the search value that the user enters in the search bar.
 */
export const useGetAllProducts = (selectCategory, searchValue) => {
  return useInfiniteQuery(
    "product_show",
    async ({ pageParam = 1 }) => {
      return axiosInstance
        .post(others_api_end_points.userWiseProductList, {
          category_id: selectCategory,
          search: searchValue,
          pagination_page: pageParam,
          pagination_per_page: 5,
        })
        .then(({ data }) => {
          return data;
        });
    },
    {
      keepPreviousData: true,

      refetchInterval: 1000 * 10,
      getNextPageParam: (lastPage) => {
        console.log(lastPage,"lastPage")
        return lastPage?.data?.length >= 5 ? lastPage?.page + 1 : undefined;
      },
    }
  );
};
/**
 * It makes a GET request to the endpoint `/api/products/{productId}` and returns the response
 * @param variables - The product id
 */
export const GetProductDetails = async (variables) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.productDetails}/${variables}`)
    .then((response) => {
      if (response.status == 200) {
        return response.data;
      } else return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};

/**
 * It makes a GET request to the deleteProduct endpoint with the product id as a parameter
 * @param variables - The id of the product to be deleted.
 * @returns The response from the API call.
 */
export const GetDeleteProduct = async (variables) => {
  let _res = axiosInstance
    .get(`${others_api_end_points.deleteProduct}/${variables}`)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return _res;
};

/**
 * It returns an object with the following properties:
 *
 * - `data`: The data returned from the API.
 * - `isFetching`: Whether the request is currently being made.
 * - `isFetchingMore`: Whether the request is currently being made for more data.
 * - `isFetchingFirstTime`: Whether the request is currently being made for the first time.
 * - `isFetchingMore`: Whether the request is currently being made for more data.
 * - `isFetchingMore`: Whether the request is currently being made for more data.
 * - `isFetchingMore`: Whether the request is currently being made for more data.
 * - `isFetchingMore`: Whether the request is currently being made for more data.
 * - `isFetchingMore`: Whether the request is currently being made for more data.
 * - `isFetchingMore
 * @returns The return value is an object with the following properties:
 */
export const useGetCategoryProduct = () => {
  return useInfiniteQuery("getCategory", async ({ pageParam = 1 }) => {
    return axiosInstance
      .get(others_api_end_points.product_categories)
      .then(({ data }) => {
        return data;
      });
  });
};
