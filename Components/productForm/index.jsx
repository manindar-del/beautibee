import React, { useEffect, useState, useRef } from "react";
import { Box, Grid, IconButton, InputAdornment } from "@mui/material";
import styles from "@/styles/service/addproduct.module.scss";
import Image from "next/image";
import assets from "@/json/assest";
import {
  useCreateProduct,
  useUpdateProduct,
  GetProductDetails,
} from "@/hooks/useProducts";
import { MobileDatePicker } from "@mui/x-date-pickers";
import assest from "@/json/assest";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import { useSnackbar } from "notistack";
import Editor from "./Editor";

const ProductType = [
  {
    value: "New",
    label: "New",
  },

  {
    value: "Used",
    label: "Used",
  },
];

export default function ProductForm({ allCategoryProductList }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState({});
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [ImageOriginal, setImageOriginal] = useState(null);
  const [ImageOriginal2, setImageOriginal2] = useState(null);
  const [ImageOriginal3, setImageOriginal3] = useState(null);

  const [image3, setImage3] = useState(null);
  const [startValues, setStartValues] = React.useState("");
  const [endValues, setEndValues] = React.useState("");
  const [product_category, setProduct_Category] = useState("");
  const [productTypes, setProductTypes] = useState("");
  const [inputData, setInputData] = useState({
    title: "",
    content: "",
    price: "",
  });

  const { mutate: createProduct } = useCreateProduct();
  const { mutate: updateProduct } = useUpdateProduct();

  const [editorLoaded, setEditorLoaded] = useState(false);
  //const [data, setData] = useState("");

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  //inputfield onchange function
  let name, value;
  const postUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setInputData({ ...inputData, [name]: value });
  };

  //validation
  const validation = () => {
    let error = {};
    if (!inputData.title) {
      error.title = "Product Name is required";
    }

    // if (!data) {
    //   error.data = " Product Details is required";
    // }

    if (!inputData.content) {
      error.content = " Product Details is required";
    }

    if (!inputData.price) {
      error.price = "Price Details is required";
    }

    if (!product_category) {
      error.product_category = "Product category is required";
    }

    if (!productTypes) {
      error.productTypes = "Product Type is required";
    }
    if (!router.query.id) {
      if (!image) {
        error.image = "Image is required";
      }

      // if (!image2) {
      //   error.image2 = "Image2 is required";
      // }

      // if (!image3) {
      //   error.image3 = "Image3 is required";
      // }
    }

    return error;
  };

  const handleSelectChange = (e) => {
    setProduct_Category(e.target.value);
  };

  const handleSelectChangeType = (e) => {
    setProductTypes(e.target.value);
  };

  //add Form
  const add = (e) => {
    e.preventDefault();
    let formData = new FormData();
    let ErrorList = validation();
    setError(validation());
    if (Object.keys(ErrorList).length !== 0) {
    } else {
      formData.append("title", inputData.title);
      //formData.append("content", data);
      formData.append("content", inputData.content);
      formData.append("price", inputData.price);
      formData.append("product_category", product_category);
      if (image !== null) {
        formData.append("images", image);
      }
      if (image2 !== null) {
        formData.append("images", image2);
      }
      if (image3 !== null) {
        formData.append("images", image3);
      }
      formData.append("product_type", productTypes);

      if (router.query.id) {
        formData.append("id", router.query.id);
        updateProduct(formData);
      } else {
        createProduct(formData);
      }
    }
  };

  useEffect(() => {
    if (router.query.id) {
      GetProductDetails(router.query.id).then((data) => {
        setInputData({
          title: data?.data?.product?.title,
          content: data?.data?.product?.content,
          price: data?.data?.product?.price,
        });
        setProduct_Category(data?.data?.product?.product_category);
        setImageOriginal(data?.data?.product?.images[0]);
        setImageOriginal2(data?.data?.product?.images[1]);
        setImageOriginal3(data?.data?.product?.images[2]);
        setProductTypes(data?.data?.product?.product_type);
        //setData(data?.data?.product?.content);
      });
    }
  }, [router.query.id]);

  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };

  const handleImage = (e) => {
    // console.log(e.target.files[0], "filess");
    if (
      e.target.files[0]?.type === "image/jpeg" ||
      e.target.files[0]?.type === "image/png" ||
      e.target.files[0]?.type === "image/jpg"
    ) {
      if (e.target.files[0]?.size <= 3000000) {
        setImage(e.target.files[0]);
      } else {
        enqueueSnackbar("Please upload image of proper size.", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Please upload image of proper format.", {
        variant: "error",
      });
    }
  };

  const handleImage2 = (e) => {
    if (
      e.target.files[0]?.type === "image/jpeg" ||
      e.target.files[0]?.type === "image/png" ||
      e.target.files[0]?.type === "image/jpg"
    ) {
      if (e.target.files[0]?.size <= 3000000) {
        setImage2(e.target.files[0]);
      } else {
        enqueueSnackbar("Please upload image of proper size.", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Please upload image of proper format.", {
        variant: "error",
      });
    }
  };

  const handleImage3 = (e) => {
    if (
      e.target.files[0]?.type === "image/jpeg" ||
      e.target.files[0]?.type === "image/png" ||
      e.target.files[0]?.type === "image/jpg"
    ) {
      if (e.target.files[0]?.size <= 3000000) {
        setImage3(e.target.files[0]);
      } else {
        enqueueSnackbar("Please upload image of proper size.", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Please upload image of proper format.", {
        variant: "error",
      });
    }
  };

  return (
    <div className={styles.add_jobs}>
      <div className={styles.jobs_input}>
        <label>Product name *</label>
        <input
          type="text"
          name="title"
          onChange={postUserData}
          value={inputData.title}
          placeholder="Enter Product name"
        />
      </div>
      <div className="error">{error.title}</div>
      <div className={styles.jobs_input}>
        <label>Product details *</label>

        {/* <Editor
          name="content"
          value={data}
          onChange={(data) => {
            setData(data);
          }}
          editorLoaded={editorLoaded}
        /> */}

        <textarea
          name="content"
          onChange={postUserData}
          value={inputData.content}
          placeholder="Enter Product details"
        />
      </div>
      <div className="error">{error.content}</div>
      <div className={styles.jobs_input}>
        <label>Product price *</label>
        <input
          type="number"
          name="price"
          onChange={postUserData}
          value={inputData.price}
          placeholder="Enter Product price"
        />
      </div>
      <div className="error">{error.price}</div>
      <div className={styles.jobs_input}>
        <label>Category *</label>
        <div className={styles.select_box}>
          <Image src={assets.downarrow} width={10} height={10} />

          <select
            value={product_category}
            onChange={handleSelectChange}
            name="category"
          >
            <option value={""}>Select Category</option>
            {allCategoryProductList?.map((item, i) => (
              <option
                value={
                  item?._id === product_category ? product_category : item?._id
                }
                key={i}
                selected={
                  item.title === product_category
                    ? product_category
                    : item.title
                }
              >
                {item.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="error">{error.product_category}</div>
      <div className={styles.jobs_input}>
        <label>Product Type *</label>
        <div className={styles.select_box}>
          <Image src={assets.downarrow} width={10} height={10} />
          <select
            value={productTypes}
            onChange={handleSelectChangeType}
            name="type"
          >
            <option selected value={""}>
              Select Product Type
            </option>
            {ProductType.map((item, i) => (
              <option
                value={
                  item?.value === productTypes ? productTypes : item?.value
                }
                key={i}
                selected={
                  item.value === productTypes ? productTypes : item.label
                }
              >
                {item?.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="error">{error.productTypes}</div>

      <div className={`${styles.upload_image} ${styles.uploadnew_image} `}>
        <label>Upload Image*</label>
        <ul>
          <li>
            {/*Product image  priview */}

            {image !== "" && image !== undefined && image !== null ? (
              <Image
                src={URL.createObjectURL(image)}
                width={15}
                height={15}
                alt="img"
                className="img image_load"
              />
            ) : (
              <img
                src={
                  ImageOriginal !== null
                    ? `${mediaPath}/uploads/product/${ImageOriginal}`
                    : assest.noImage
                }
                width={108}
                height={108}
                onError={onErrorImg}
              />
            )}
            {/*  Product image  priview */}

            <input
              type="file"
              onChange={handleImage}
              placeholder="Date"
              accept="image/*"
            />
            {error.image ? (
              <div className={`${styles.error} ${styles.error_space} `}>
                {error.image}
              </div>
            ) : null}
          </li>
          <li>
            {/*Product image  priview */}

            {image2 !== "" && image2 !== undefined && image2 !== null ? (
              <img
                src={URL.createObjectURL(image2)}
                width={15}
                height={15}
                alt="img"
                className="img image_load"
              />
            ) : (
              <img
                src={
                  ImageOriginal2 !== null
                    ? `${mediaPath}/uploads/product/${ImageOriginal2}`
                    : assest.noImage
                }
                width={108}
                height={108}
                onError={onErrorImg}
              />
            )}
            {/*  Product image  priview */}
            <input
              type="file"
              onChange={handleImage2}
              placeholder="Date"
              accept="image/*"
            />

            {/* <div className="error">{error.image2}</div> */}
          </li>
          <li>
            {/*Product image  priview */}

            {image3 !== "" && image3 !== undefined && image3 !== null ? (
              <img
                src={URL.createObjectURL(image3)}
                width={15}
                height={15}
                alt="img"
                className="img image_load"
              />
            ) : (
              <img
                src={
                  ImageOriginal3 !== null
                    ? `${mediaPath}/uploads/product/${ImageOriginal3}`
                    : assest.noImage
                }
                width={108}
                height={108}
                onError={onErrorImg}
              />
            )}
            {/*  Product image  priview */}
            <input
              type="file"
              onChange={handleImage3}
              placeholder="Date"
              accept="image/*"
            />

            {/* <div className="error">{error.image3}</div> */}
          </li>
        </ul>
      </div>
      <div className={styles.job_location}>
        <div className={styles.upload_image}>
          <button type="button" onClick={add}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
