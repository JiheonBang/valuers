import React, { useState, useEffect } from "react";
import { authService, dbService } from "../firebase/initFirebase";
import { useRouter } from "next/router";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Loading() {
  const router = useRouter();
  authService.onAuthStateChanged(async (user) => {
    if (user) {
      const infoSnapshot = await dbService.doc(`userInfo/${user.uid}`).get();
      if (infoSnapshot.data() && infoSnapshot.data().userLink) {
        router.push(`/${infoSnapshot.data().userLink}`);
      } else {
        router.push("/onboarding");
      }
    }
  });
  return (
    <>
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    </>
  );
}

export default Loading;
