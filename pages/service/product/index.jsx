import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/service/products.module.scss";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import assets from "@/json/assest";
import { Button, IconButton } from "@mui/material";
import { Box, Divider, Grid, Menu, MenuItem } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/router";
import Link from "next/link";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetAllProducts,
  GetDeleteProduct,
  useGetCategoryProduct,
} from "@/hooks/useProducts";
import { styled, alpha } from "@mui/material/styles";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { notiStackType } from "@/json/notiJson/notiJson";
import Slider from "react-slick";
import CloseIcon from "@mui/icons-material/Close";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
var product_details = {
  dots: false,
  infinite: true,
  nav: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function Index() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectCategory, setSelectCategory] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  //console.log(searchValue,"searchValue");
  const openMenu = Boolean(anchorEl);
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const { mutate: deleteProduct } = useMutation("product", (variables) =>
    GetDeleteProduct(variables)
  );

  const {
    isLoading,
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetAllProducts(selectCategory, searchValue);
  

  const { data: allProductCategory } = useGetCategoryProduct();

  useEffect(() => {
    if (!selectCategory || selectCategory) {
      refetch();
    }
  }, [selectCategory]);

  useEffect(() => {
    if (searchValue || !searchValue) {
      refetch();
    }
  }, [searchValue]);

  const deleteToItem = (id) => {
    if (id) {
      deleteProduct(id, {
        onSuccess: () => {
          enqueueSnackbar(
            "Product successfully deleted",
            notiStackType.success
          );
          refetch();
        },
      });
    } else {
      enqueueSnackbar("Something Wrong", notiStackType.error);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [menuId, setMenuId] = React.useState(null);
  const openIndividualMenu = (id) => {
    setMenuId(id);
  };

  const onErrorImg = (ev) => {
    ev.target.src = assets.noImage;
  };

  return (
    <DashboardWrapper headerType="search" page="service">
      <div className={styles.mainwraper}>
        <div className="container">
          <section className={styles.pageOrder}>
            <div className={styles.heading_top}>
              <h3
                className="headingH3 pointerBtn"
                onClick={() => router.push("/service/dashboard")}
              >
                <KeyboardBackspaceIcon /> Dashboard
              </h3>
              <button onClick={() => router.push("/service/product/create")}>
                Add Product+
              </button>
            </div>
            <div className={styles.header_search_bar}>
              <div className={styles.search_field}>
                <Button>
                  <Image
                    src={assets.searchicon}
                    alt="img"
                    width={20}
                    height={20}
                  />
                </Button>
                <input
                  type="text"
                  placeholder="Search Product"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className={styles.select_cat}>
                <label>Select Category</label>
                <select
                  value={selectCategory}
                  onChange={(e) => setSelectCategory(e.target.value)}
                >
                  <option value={""}>Select Category</option>
                  {allProductCategory?.pages[0].data?.length > 0 ? (
                    allProductCategory?.pages[0].data.map((item) => {
                      return (
                        <option key={item?._id} value={item?._id}>
                          {item?.title}
                        </option>
                      );
                    })
                  ) : (
                    <option>No Category available</option>
                  )}
                </select>
              </div>
            </div>

            <ul className={styles.listing_sec}>
              {data?.pages[0]?.data?.length > 0 ? (
                data?.pages[0]?.data.map((item) => {
                  return (
                    <>
                      <li key={item?._id}>
                        <div className={styles.listing_box}>
                          <Slider {...product_details}>
                            {item?.images.map((index, element) => {
                              return (
                                <div className={styles.productimg}>
                                  {item?.images !== null ? (
                                    <img
                                      src={`${mediaPath}/uploads/product/${item.images[element]}`}
                                      alt="img"
                                      width={111}
                                      height={43}
                                      onError={onErrorImg}
                                    />
                                  ) : (
                                    <Image
                                      src={assets.noImage}
                                      alt="img"
                                      width={111}
                                      height={43}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </Slider>

                          <div className={styles.cont_box}>
                            <Link href={`product/${item._id}`}>
                              <h2>{item?.title}</h2>
                              <h3>{item?.category_info?.title}</h3>
                              <h3>{item?.product_type}</h3>
                              <h4>${item?.price}</h4>
                            </Link>
                            <IconButton
                              className={styles.plusicon}
                              id={`demo-customized-menu-${item._id}`}
                              aria-controls={
                                openMenu
                                  ? `demo-customized-menu-${item._id}`
                                  : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openMenu ? "true" : undefined}
                              variant="contained"
                              disableElevation
                              onClick={(e) => {
                                handleClickMenu(e);
                                openIndividualMenu(item._id);
                              }}
                            >
                              <Image
                                src={assets.blackdots}
                                alt="img"
                                width={15}
                                height={15}
                              />
                            </IconButton>
                            <Menu
                              className="menu_listing"
                              id={`demo-customized-menu-${item._id}`}
                              MenuListProps={{
                                "aria-labelledby": `demo-customized-menu-${item._id}`,
                              }}
                              anchorEl={anchorEl}
                              open={
                                menuId === item._id && openMenu ? true : false
                              }
                              onClose={handleCloseMenu}
                            >
                              <MenuItem
                                onClick={() =>
                                  router.push(
                                    `/service/product/edit/${item._id}`
                                  )
                                }
                              >
                                <EditIcon />
                                Edit
                              </MenuItem>
                              <Divider sx={{ my: 0.5 }} />

                              <MenuItem
                                onClick={() => deleteToItem(item?._id)}
                                sx={{ color: "red" }}
                              >
                                <DeleteIcon />
                                Delete
                              </MenuItem>

                              <Box className="close_button">
                                {/* <CloseIcon /> */}
                              </Box>
                            </Menu>
                          </div>
                        </div>
                      </li>
                    </>
                  );
                })
              ) : (
                <h1 style={{ textAlign: "center", width: "100%" }}>
                  No Product available
                </h1>
              )}
            </ul>
          </section>
          {hasNextPage && !isFetchingNextPage && (
            <button
              className={styles.loadmore}
              onClick={() => {
                fetchNextPage();
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              View more
            </button>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default Index;
