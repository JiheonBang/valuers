import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NotionRenderer, BlockMapType } from "react-notion";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { authService, dbService } from "../firebase/initFirebase";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

import {
  PersonaButton,
  PersonaButton2,
  OutlinedButton,
  TextButton,
} from "../components/styledButton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PersonIcon from "@mui/icons-material/Person";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export async function getServerSideProps(context) {
  const pageId = context.params?.pageId;

  if (!pageId) {
    return;
  }

  const data = await fetch(
    `https://notion-api.splitbee.io/v1/page/${pageId[1]}`
  ).then((res) => res.json());

  const linkDataSet = [];
  const userData = await dbService.collection("userInfo").get();
  userData.forEach((doc) =>
    doc.data().userLink === pageId[0] ? linkDataSet.push(doc.data()) : null
  );

  return {
    props: {
      blockMap: data,
      pageId: pageId,
      pageUser: linkDataSet[0],
    },
  };
}

function NotionPage({ blockMap, pageId, pageUser }) {
  const [currentUser, setCurrentUser] = useState(pageUser);

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
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
      {currentUser ? <Sidebar /> : <Navbar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: "100%", md: "65%" },
          ml: currentUser ? { md: `25%` } : { md: "17.5%" },
          mr: currentUser ? { md: `10%` } : { md: "17.5%" },
          mt: currentUser ? { md: "2rem" } : null,
          pt: currentUser ? null : "100px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "22vmin",
              height: "22vmin",
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#E7E5FF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {pageUser.userImage ? (
              <Image
                src={pageUser.userImage}
                alt="profile image"
                width="200%"
                height="200%"
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "70%",
            }}
          >
            <div style={{ marginLeft: "2rem" }}>
              <div
                style={{
                  fontSize: "5vmin",
                  fontWeight: "600",
                  marginBottom: "3.5vmin",
                }}
              >
                {pageUser.userName}
              </div>
              <span
                style={{
                  fontSize: "2vmin",
                  fontWeight: "600",
                  padding: "1vmin",
                  backgroundColor: setColor(pageUser.userJob),
                  borderRadius: "10px",
                }}
              >
                {pageUser.userJob}
              </span>
              <span
                style={{
                  fontSize: "2vmin",
                  fontWeight: "600",
                  padding: "1vmin",
                  backgroundColor: "#eeeeee",
                  borderRadius: "10px",
                  marginLeft: "0.5rem",
                }}
              >
                {pageUser.userCareer}
              </span>
            </div>
            <div>
              {currentUser && currentUser.uid !== pageUser.userId ? (
                <Tooltip title="열심히 준비 중입니다!" arrow>
                  <OutlinedButton style={{ cursor: "not-allowed" }}>
                    Contact
                  </OutlinedButton>
                </Tooltip>
              ) : null}
            </div>
          </div>
        </div>
        <div>
          <NotionRenderer
            blockMap={blockMap}
            fullPage={false}
            customBlockComponents={{
              page: ({ blockValue, renderComponent }) => (
                <Link href={`/${pageId[0]}/${blockValue.id}`}>
                  {renderComponent()}
                </Link>
              ),
            }}
          />
        </div>
      </Box>
    </>
  );
}

export default NotionPage;
