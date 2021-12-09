import React from "react";
import Head from "next/head";
import "../styles/globals.css";
// core styles shared by all of react-notion-x (required)
import "react-notion/src/styles.css";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { green } from "@mui/material/colors";

const Root = styled("div")(({ theme }) => ({
  padding: 0,
  [theme.breakpoints.down("sm")]: {
    fontSize: "12px",
  },
  [theme.breakpoints.up("sm")]: {
    fontSize: "14px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "16px",
  },
}));

function MyApp({ Component, pageProps }) {
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
