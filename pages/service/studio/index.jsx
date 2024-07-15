import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/service/studio.module.scss";
import Typography from "@mui/material/Typography";
import { Button, IconButton } from "@mui/material";
import { Box, Divider, Grid, Menu, MenuItem } from "@mui/material";
import Image from "next/image";
import assets from "@/json/assest";
import PropTypes from "prop-types";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Slider from "react-slick";
import { useRouter } from "next/router";
import {
  useGetAllstudios,
  GetDeleteStudio,
  useGetCategoryStudio,
} from "@/hooks/useStudio";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import Link from "next/link";
import assest from "@/json/assest";
import { styled, alpha } from "@mui/material/styles";
import { useMutation } from "react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import { notiStackType } from "@/json/notiJson/notiJson";

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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

var settings = {
  dots: true,
  infinite: true,
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
    position: "absolute",
    left: "120px!important",
    top: "30px!important",
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
  const [value, setValue] = React.useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [categoryId, setCategoryId] = useState(null);

  const openMenu = Boolean(anchorEl);
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const {
    data: allStudioList,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllstudios(categoryId);

  const { data: studioCategory } = useGetCategoryStudio();

  const { mutate: deleteStudio } = useMutation("studio", (variables) =>
    GetDeleteStudio(variables)
  );

  const deleteToItem = (id) => {
    if (id) {
      deleteStudio(id, {
        onSuccess: () => {
          enqueueSnackbar("Studio successfully deleted", notiStackType.success);
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

  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };
  // menu id of particular item
  const [menuId, setMenuId] = React.useState(null);
  const openIndividualMenu = (id) => {
    setMenuId(id);
  };

  return (
    <DashboardWrapper headerType="search" page="service">
      <div className={styles.mainwraper}>
        <div className="container">
          <div className={styles.heading_top}>
            <h3
              className="headingH3 pointerBtn"
              onClick={() => router.push("/service/dashboard")}
            >
              <KeyboardBackspaceIcon /> Dashboard
            </h3>
            <button onClick={() => router.push("/service/studio/create")}>
              Add Studio+
            </button>
          </div>
          <div className={styles.tab_bar}>
            <div className={styles.btnGroups}>
              <Box>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label={"All"}
                    {...a11yProps(0)}
                    onClick={() => {
                      setCategoryId(null);
                    }}
                  />

                  {studioCategory?.pages[0]?.data.map((item, i) => {
                    return (
                      <Tab
                        label={item?.title}
                        {...a11yProps(i)}
                        onClick={() => {
                          setCategoryId(item?._id);
                        }}
                      />
                    );
                  })}
                </Tabs>
              </Box>
            </div>
          </div>

          <div className={styles.oredrBox}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                {allStudioList?.pages[0]?.data?.length > 0 ? (
                  allStudioList?.pages[0]?.data.map((item, i) => {
                    console.log(item)
                    return (
                      <Grid key={item?._id} item sm={3} xs={12}>
                        <div className={styles.topOrderSec}>
                          <IconButton
                            className={styles.plusiconone}
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
                                router.push(`/service/studio/edit/${item._id}`)
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

                            <Box className="close_button"></Box>
                          </Menu>
                          <div className={styles.listing_box}>
                            <div key={item?._id}>
                              <div className={styles.img_box}>

                              {/* {item?.images !== null ? (
                            <img
                              src={`${mediaPath}/uploads/studio/images/${item?.images}`}
                              width={200}
                              height={200}
                              onError={onErrorImg}
                            />
                          ) : (
                            <Image
                              src={assets.noImage}
                              alt="img"
                              width={200}
                              height={200}
                            />
                          )} */}
                                {/*<video
                                  src={`${mediaPath}/uploads/studio/videos/${item?.video}`}
                                  width={215}
                                  height={275}
                                /> */}
                                <Image
                                  src={`${mediaPath}/uploads/studio/images/${item?.images[0]}`}
                                  alt="thumbnail image"
                                  width={215}
                                  height={275}
                                />
                              </div>
                            </div>

                            <div className={styles.cont_box}>
                              <h4>{item?.category_info?.title}</h4>
                              <div className={styles.rating_box}>
                                <div className={styles.left_cont_box}>
                                  {item?.user_info?.business_image !== null ? (
                                    <img
                                      src={`${mediaPath}/uploads/user/business_image/${item?.user_info?.business_image}`}
                                      alt="img"
                                      width={40}
                                      height={40}
                                      onError={onErrorImg}
                                    />
                                  ) : (
                                    <Image
                                      src={assets.noImage}
                                      alt="img"
                                      width={40}
                                      height={40}
                                    />
                                  )}
                                </div>
                                <div className={styles.right_cont_box}>
                                  <h2>{item?.user_info?.full_name}</h2>
                                  <h2>{item?.user_info?.email}</h2>
                                  <p>
                                    {item?.location}{" "}
                                    <span>
                                      <Image
                                        src={assets.star}
                                        alt="img"
                                        width={12}
                                        height={12}
                                      />{" "}
                                     {item?.user_info?.rating}
                                    </span> 
                                    ({item?.user_info?.total_count})
                                  </p>
                                </div>
                              </div>
                              <Link href={`studio/${item._id}`}>
                                <button>See Details</button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    );
                  })
                ) : (
                  <h1 style={{ textAlign: "center", width: "100%", marginTop:"33px" }}>
                    No Studio Items Available
                  </h1>
                )}
              </Grid>
            </Box>
          </div>

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
              Load more
            </button>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default Index;
