import DashboardWrapper from "@/layout/Wrappers/DashboardWrapper";
import React, { useState, useEffect } from "react";
import styles from "@/styles/service/service.module.scss";
import { Box, Divider, Grid, Menu, MenuItem } from "@mui/material";
import { Button, IconButton } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Image from "next/image";
import assets from "@/json/assest";
import { useRouter } from "next/router";
import {
  useGetAllServices,
  useDeleteService,
  useServicesList,
} from "@/hooks/useService";
import Link from "next/link";
import { styled, alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Edit from "./edit/[id]";
import CloseIcon from "@mui/icons-material/Close";
import { getProfileDetails } from "@/reduxtoolkit/profile.slice";
import { useDispatch, useSelector } from "react-redux";
import { toHoursAndMinutes } from "@/lib/functions/_common.lib";

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
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const { isProfileLoading, getProfileData } = useSelector(
    (store) => store.profile
  );

  const userId = getProfileData?._id;

  const { mutate: deleteService } = useDeleteService();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useServicesList(categoryId, userId);

  const deleteToItem = (id) => {
    let formData = new FormData();
    formData.append("service_id", id);
    deleteService(formData, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const [menuId, setMenuId] = React.useState(null);
  const openIndividualMenu = (id) => {
    setMenuId(id);
  };

  useEffect(() => {
    dispatch(getProfileDetails());
  }, []);

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
            <button onClick={() => router.push("/service/service/create")}>
              Add Service+
            </button>
          </div>
          {data?.pages[0]?.data?.length > 0 ? (
            data?.pages[0]?.data.map((item) => {
              return (
                <div className={styles.service_listing}>
                  <ul>
                    <>
                      <li>
                        <Link href={`service/${item._id}`}>
                          <div className={styles.left_cont}>
                            <p>{item?.title}</p>
                            <div
                              className={`${styles.price_cont} ${styles.price_contone}`}
                            >
                              <h3>${item?.price}</h3>
                              <h3>{item?.experience_info}</h3>
                              <h3>{toHoursAndMinutes(item?.duration)}</h3>
                            </div>
                            <div className={styles.service_listing}>
                              <h3>{item?.category_info?.title}</h3>
                            </div>
                          </div>
                        </Link>
                        <IconButton
                          className={styles.right_cont}
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
                            src={assets.dotson}
                            alt="img"
                            width={33}
                            height={33}
                          />
                        </IconButton>
                      </li>

                      <Menu
                        className="menu_listing"
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
                            router.push(`/service/service/edit/${item._id}`)
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
                    </>
                  </ul>
                </div>
              );
            })
          ) : (
            <div
              style={{
                textAlign: "center",
                width: "100%",
              }}
            >
              <h2>No Service Available</h2>
            </div>
          )}
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
