import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useEffect, useState } from "react";
import styles from "@/styles/service/training.module.scss";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import assets from "@/json/assest";
import PropTypes from "prop-types";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";
import { useGetAllTrainings, GetDeleteTraining } from "@/hooks/useTraining";
import { mediaPath } from "@/api/Endpoints/apiEndPoints";
import moment from "moment";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { Box, Divider, Grid, Menu, MenuItem } from "@mui/material";
import { Button, IconButton } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { notiStackType } from "@/json/notiJson/notiJson";
import { useMutation } from "react-query";
import assest from "@/json/assest";

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
    top: "264px!important",
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

function index() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const { mutate: deleteTraining } = useMutation("training", (variables) =>
    GetDeleteTraining(variables)
  );

  const { data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllTrainings();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const deleteToItem = (id) => {
    if (id) {
      deleteTraining(id, {
        onSuccess: () => {
          enqueueSnackbar(
            "Training successfully deleted",
            notiStackType.success
          );
          refetch();
        },
      });
    } else {
      enqueueSnackbar("Something Wrong", notiStackType.error);
    }
  };

  const onErrorImg = (ev) => {
    ev.target.src = assest.noImage;
  };

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
            <button onClick={() => router.push("/service/training/create")}>
              Add Training+
            </button>
          </div>
          <div className={styles.tab_bar}>
            <div className={styles.btnGroups}>
              {/* <Box>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="For You" {...a11yProps(0)} />
                  <Tab label="Collections" {...a11yProps(1)} />
                  <Tab label="New Expert" {...a11yProps(2)} />
                  <Tab label="Lorem Ipsum" {...a11yProps(3)} />
                  <Tab label="Lorem Ipsum" {...a11yProps(4)} />
                </Tabs>
              </Box> */}
            </div>
          </div>

          <TabPanel value={value} index={0}>
            <section className={styles.pageOrder}>
              <div className={styles.heading_sec1}>
                <h3 className="headingH3">Tutorial Videos</h3>
                <div className={styles.view_all}>
                  {hasNextPage && !isFetchingNextPage && (
                    <button
                      onClick={() => {
                        fetchNextPage();
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      View All
                    </button>
                  )}
                </div>
              </div>
              <ul className={styles.listing_sec1}>
                {data?.pages[0]?.data?.length > 0 ? (
                  data?.pages[0]?.data.map((item) => {
                    return (
                      <>
                        <li>
                          <IconButton
                           className={`${styles.plusicon} ${styles.listing_sec2}`}
                          //  className={styles.}
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
                            {" "}
                            <Image
                              src={assets.dotson}
                              alt="img"
                              width={33}
                              height={33}
                            />{" "}
                          </IconButton>
                          <Link href={`training/${item._id}`}>
                            <div className={styles.listing_box}>
                              <div className={styles.productimg}>
                                <video width={215} height={275} controls>
                                  <source
                                    src={`${mediaPath}/uploads/training/Videos/${item?.video}`}
                                    type="video/mp4"
                                  ></source>
                                </video>
                              </div>
                              <div className={styles.cont_box}>
                                <h2>{item?.title}</h2>
                                <p>
                                  {moment(item?.publish_date).format(
                                    "MMM Do YY"
                                  )}
                                </p>
                                <p>{item?.user_info?.business_name}</p>
                              </div>
                            </div>
                          </Link>
                        </li>
                        <Menu
                          id={`demo-customized-menu-${item._id}`}
                          MenuListProps={{
                            "aria-labelledby": `demo-customized-menu-${item._id}`,
                          }}
                          anchorEl={anchorEl}
                          open={menuId === item._id && openMenu ? true : false}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem
                            onClick={() =>
                              router.push(`/service/training/edit/${item._id}`)
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
                        </Menu>
                      </>
                    );
                  })
                ) : (
                  <h1 style={{ textAlign: "center", width: "100%" }}>
                    No Training available
                  </h1>
                )}
              </ul>
            </section>
          </TabPanel>
        </div>
      </div>
    </DashboardWrapper>
  );
}

export default index;
