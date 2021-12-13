import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { dbService, authService } from "../firebase/initFirebase";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import ButtonBase from "@mui/material/ButtonBase";
import PersonIcon from "@mui/icons-material/Person";
import { ExploreButtonBase } from "../components/styledButton";

export default function Explore({ userData }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState();

  authService.onAuthStateChanged((user) => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  const setColor = (item) => {
    switch (item) {
      case "대표":
        return "#CCE6FF";
      case "기획/PM/PO":
        return "#FFE6CD";
      case "디자인":
        return "#FECCFF";
      case "개발":
        return "#FECBCB";
      case "인사관리":
        return "#FFFFCC";
      case "영업/마케팅":
        return "#E6FFCC";
      case "프리랜서":
        return "#CBFFE6";
      case "대학생/취업준비":
        return "#CDFFFE";
      case "기타":
        return "#eeeeee";
    }
  };

  return (
    <>
      {isLoggedIn ? <Sidebar /> : <Navbar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: isLoggedIn ? { md: `25%` } : { md: "10%" },
          mr: isLoggedIn ? { md: `10%` } : { md: "10%" },
          mt: isLoggedIn ? { md: "2rem" } : null,
          pt: isLoggedIn ? null : "100px",
          flexGrow: 1,
        }}
      >
        <h2>둘러보고, 새로운 기회를 만드세요 🚀</h2>
        <Divider sx={{ mb: "2rem" }} />
        <Grid container spacing={2}>
          {userData.map((each) => (
            <Grid
              key={each.userId}
              item
              xs={5.7}
              md={isLoggedIn ? 2.6 : 2.2}
              style={{
                margin: "1vmin",
                padding: 0,
                height: "35vmin",
                minHeight: "12rem",
                border: "1px solid #eeeeee",
                borderRadius: "10px",
              }}
            >
              <ExploreButtonBase
                onClick={() => router.push(`/${each.userLink}`)}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "13vmin",
                      height: "13vmin",
                      minWidth: "5rem",
                      minHeight: "5rem",
                      borderRadius: "50%",
                      overflow: "hidden",
                      backgroundColor: "#E7E5FF",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "-0.5rem",
                    }}
                  >
                    {each.userImage ? (
                      <Image
                        src={each.userImage}
                        alt="profile image"
                        width="230%"
                        height="230%"
                      />
                    ) : (
                      <PersonIcon
                        style={{
                          width: "80%",
                          height: "80%",
                          color: "#5254F3",
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "150%",
                        fontWeight: "600",
                        margin: "1.2rem 0vmin 1rem 0",
                      }}
                    >
                      {each.userName}
                    </div>
                    <span
                      style={{
                        fontSize: "90%",
                        fontWeight: "600",
                        padding: "1vmin",
                        backgroundColor: setColor(each.userJob),
                        borderRadius: "10px",
                      }}
                    >
                      {each.userJob}
                    </span>
                    <span
                      style={{
                        fontSize: "90%",
                        fontWeight: "600",
                        padding: "1vmin",
                        backgroundColor: "#eeeeee",
                        borderRadius: "10px",
                        marginLeft: "0.5rem",
                      }}
                    >
                      {each.userCareer}
                    </span>
                  </div>
                </div>
              </ExploreButtonBase>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export async function getServerSideProps() {
  const userDataSet = [];
  const userData = await dbService.collection("userInfo").get();
  userData.forEach((doc) => userDataSet.push(doc.data()));

  const notionDataSet = [];
  const notionData = await dbService.collection("userData").get();
  notionData.forEach((doc) => notionDataSet.push(doc.data()));

  let existDataSet = [];
  userDataSet.map((item) => {
    notionDataSet.map((each) => {
      item.userId === each.userId ? existDataSet.push(item) : null;
    });
  });

  return {
    props: {
      key: userDataSet[0].userId,
      userData: Array.from(new Set(existDataSet)),
    },
  };
}
