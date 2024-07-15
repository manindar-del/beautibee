import Image from "next/image";
import { useId } from "react";
import styles from "@/styles/layout/_footer.module.scss";
import assest from "@/json/assest";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from "next/link";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {useGetAllSocialSetting} from "@/hooks/useSocialSetting"
const Footer = () => {

  const {data:socialSettingList} = useGetAllSocialSetting();
  //console.log(socialSettingList,"socialSettingList");

  

  const id = useId();
  return (
    <footer id={`${id}_footer`}>
      <div className={styles.footer}>
        <div className="container">
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item lg={2} xs={12}>
                <div className={styles.FooterLogo}>
                  <Image src={assest.FooterLogo} alt="img" width={160} height={90} />
                </div>
              </Grid>
              <Grid item lg={6} xs={12}>
                <div className={styles.FooterLinks}>
                  <ul>
                    <li className={styles.active}>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link href="/about">About Us</Link>
                    </li>
                    <li>
                      <Link href="/user/blog">Blog</Link>
                    </li>
                    <li>
                      <Link href="/search-provider">Service Listing</Link>
                    </li>
                    <li>
                      <Link href="/user/products">Products</Link>
                    </li>
                    <li>
                      <Link href="/user/training">Training</Link>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <Link href="/terms">Terms & condition</Link>
                    </li>
                    <li>
                      <Link href="/privacy">Privacy Center</Link>
                    </li>
                    {/* <li>
                      <Link href="/">Cookies</Link>
                    </li> */}
                  </ul>
                  <ul>
                    {/* <li>
                      <Link href="/">Recommended</Link>
                    </li> */}
                    <li>
                      <Link href="/contact">Contact Us</Link>
                    </li>
                  </ul>
                </div>
              </Grid>
              <Grid item lg={4} xs={12}>
                <div className={styles.FooterApp}>
                  <h4>Apply on the go</h4>
                  <p>Lorem ipsum dolor sit amet, consectetur</p>
                  <div className={styles.getApp}>
                    <Link href="/"><Image src={assest.apple} alt="img" width={150} height={50} /></Link>
                    <Link href="/"><Image src={assest.palystore} alt="img" width={168} height={50} /></Link>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>

        </div>
      </div>
      <div className={styles.bottomFooter}>
        <div className="container">
          <div className={styles.dflexBetween}>
            <p>© Copyright 2023 Beautibee | All Rights Reserved.</p>
            <ul>
              <li>
                <Link href={`${socialSettingList?.data?.facebookLink}`} target="_blank"><FacebookIcon /></Link>
              </li>
              <li>
                <Link href={`${socialSettingList?.data?.twitterLink}`} target="_blank"><TwitterIcon /></Link>
              </li>
              <li>
                <Link href={`${socialSettingList?.data?.instagramLink}`} target="_blank"><InstagramIcon /></Link>
              </li>
              <li>
                <Link href={`${socialSettingList?.data?.youtubeLink}`} target="_blank"><YouTubeIcon /></Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
