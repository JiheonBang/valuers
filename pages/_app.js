import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import "../styles/globals.css";
// core styles shared by all of react-notion-x (required)
import "../styles/notion-styles.css";
import "prismjs/themes/prism-tomorrow.css";
import * as gtag from "../lib/gtag";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { green } from "@mui/material/colors";

const Root = styled("div")(({ theme }) => ({
  padding: 0,
  [theme.breakpoints.down("sm")]: {
    fontSize: "13px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "14.5px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "16px",
  },
}));

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Root>
        <Head>
          <title>Valuers</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </Root>
    </>
  );
}

export default MyApp;
