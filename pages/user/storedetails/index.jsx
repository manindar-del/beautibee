
import React from "react";
import DashboardWrapper from '@/layout/Wrappers/DashboardWrapper';
import styles from "@/styles/pages/storedetails.module.scss";
import assets from "@/json/assest";
import Box from '@mui/material/Box';
import Image from 'next/image';
import Grid from "@mui/material/Grid";
import Rating from "@/components/Rating/Rating";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Link from "@/themes/overrides/Link";
import MyButton from "@/ui/Buttons/MyButton/MyButton";


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


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function index() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <DashboardWrapper headerType="search" page="user">
      <div className="container">
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <div className={styles.listing_sec}>
                <div className={styles.left_cont_sec}>
                  <Image
                    src={assets.detailsimg}
                    alt="img"
                    width={130}
                    height={130}
                  />
                </div>
                <div className={styles.right_cont_sec}>
                  <h2>Amber Marshall</h2>
                  <h3>Professional</h3>
                  <h4>
                    Business name: <span>Amber Marshall</span>
                  </h4>
                  <h5>
                    <Image
                      src={assets.instragram}
                      alt="img"
                      width={18}
                      height={18}
                    />{" "}
                    <p>@HairBy_Amber</p>
                  </h5>
                  <div className={styles.rating_box}>
                    <Rating />
                    <h6>
                      {" "}
                      4.9 <p>(575)</p>{" "}
                    </h6>
                  </div>
                  <div className={styles.share_wishlist}>
                    <div className={styles.share_wishlist_btn}>
                      <button>
                        <Image
                          src={assets.share}
                          alt="img"
                          width={20}
                          height={9}
                        />
                      </button>
                    </div>
                    <div className={styles.share_wishlist_btn}>
                      <button>
                        <Image
                          src={assets.wishlist}
                          alt="img"
                          width={10}
                          height={9}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.description_sec}>
                <h2>Description</h2>
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standardLorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard
                </p>
              </div>
              <div className={styles.tab_bar}>
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                    >
                      <Tab label="Services" {...a11yProps(0)} />
                      <Tab label="Reviews" {...a11yProps(1)} />
                      <Tab label="About" {...a11yProps(2)} />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    <div className={styles.tab_details}>
                      <ul>
                        <li>Hair Cuts</li>
                        <li>Shampoo Services</li>
                        <li>Starter Locs</li>
                        <li>Loc Maintenance</li>
                        <li>Loc Styles</li>
                        <li>Braids</li>
                        <li>Natural Hair Styles</li>
                        <li>Extensions</li>
                        <li>Thermal Irons</li>
                        <li>Color Service’s</li>
                      </ul>
                      <h2>Hair Cuts</h2>
                      <div className={styles.content_sec}>
                        <div className={styles.cuts_listing}>
                          <h2>Bang Trim</h2>
                          <h3>$15 and up for 15 minutes</h3>
                          <p>
                            Add face framing-detail to your look with a bang
                            trim.
                          </p>
                          <button>More Info</button>
                        </div>
                        <MyButton>Book Now</MyButton>
                      </div>
                      <div className={styles.content_sec}>
                        <div className={styles.cuts_listing}>
                          <h2>Women's Cut</h2>
                          <h3>$15 and up for 15 minutes</h3>
                          <p>
                            Add face framing-detail to your look with a bang
                            trim.
                          </p>
                          <button>More Info</button>
                        </div>
                        <MyButton>Book Now</MyButton>
                      </div>
                      <div className={styles.content_sec}>
                        <div className={styles.cuts_listing}>
                          <h2>Women's Trim</h2>
                          <h3>$15 and up for 15 minutes</h3>
                          <p>
                            Add face framing-detail to your look with a bang
                            trim.
                          </p>
                          <button>More Info</button>
                        </div>
                        <MyButton>Book Now</MyButton>
                      </div>
                      <div className={styles.content_sec}>
                        <div className={styles.cuts_listing}>
                          <h2>Bang Trim</h2>
                          <h3>$15 and up for 15 minutes</h3>
                          <p>
                            Add face framing-detail to your look with a bang
                            trim.
                          </p>
                          <button>More Info</button>
                        </div>
                        <MyButton>Book Now</MyButton>
                      </div>
                      <div className={styles.loadmore}>Load more result</div>
                    </div>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    Item Two
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    Item Three
                  </TabPanel>
                </Box>
              </div>
            </Grid>
            <Grid item md={4} xs={12}>
              <div className={styles.gallery_box}>
                <Image
                  src={assets.gallery1}
                  alt="img"
                  width={176}
                  height={122}
                />
                <Image
                  src={assets.gallery2}
                  alt="img"
                  width={176}
                  height={122}
                />
                <Image
                  src={assets.gallery3}
                  alt="img"
                  width={176}
                  height={122}
                />
                <Image
                  src={assets.gallery4}
                  alt="img"
                  width={176}
                  height={122}
                />
                <Image
                  src={assets.gallery5}
                  alt="img"
                  width={176}
                  height={122}
                />
                <Image
                  src={assets.gallery6}
                  alt="img"
                  width={176}
                  height={122}
                />
              </div>
              <div className={styles.map}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14736.281053276303!2d88.4306861!3d22.57647525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1669368668982!5m2!1sen!2sin"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                ></iframe>
                <h2>Amber Marshall</h2>
                <p>2301 Hillman Street Youngstown, OH 44511 3305595457</p>
                <MyButton>
                  <Image src={assets.chat} alt="img" width={130} height={130} />{" "}
                  Chat
                </MyButton>
              </div>
              <div className={styles.hours}>
                <h2>Business Hours</h2>
                <table>
                  <tr>
                    <td>Sunday :</td>
                    <td>Closed </td>
                  </tr>
                  <tr>
                    <td>Monday :</td>
                    <td>Closed</td>
                  </tr>
                  <tr>
                    <td>Tuesday :</td>
                    <td>9:00 AM</td>
                  </tr>
                  <tr>
                    <td>Wednesday :</td>
                    <td>7:00 PM-9:00 AM</td>
                  </tr>
                  <tr>
                    <td>Thursday :</td>
                    <td>7:00 PM-9:00 AM</td>
                  </tr>
                  <tr>
                    <td>Friday :</td>
                    <td>7:00 PM-9:00 AM</td>
                  </tr>
                  <tr>
                    <td>Saturday :</td>
                    <td>7:00 AM-5:00 PM</td>
                  </tr>
                </table>
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>
    </DashboardWrapper>
  );
}
export default index