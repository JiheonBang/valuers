import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { NotionAPI } from "notion-client";
import { NotionRenderer, Collection, CollectionRow } from "react-notion-x";

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

  const notion = new NotionAPI();
  let notionRes = [];
  const data = await notion.getPage(pageId[1]);

  const linkDataSet = [];
  const userData = await dbService.collection("userInfo").get();
  userData.forEach((doc) =>
    doc.data().userLink === pageId[0] ? linkDataSet.push(doc.data()) : null
  );

  return {
    props: {
      recordMap: data,
      pageId: pageId,
      pageUser: linkDataSet[0],
    },
  };
}

function NotionPage({ recordMap, pageId, pageUser }) {
  const [currentUser, setCurrentUser] = useState(pageUser);
  const [contactOpen, setContactOpen] = useState(false);

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  });

  const setColor = (item) => {
    switch (item) {
      case "??????":
        return "#CCE6FF";
      case "??????/PM/PO":
        return "#FFE6CD";
      case "?????????":
        return "#FECCFF";
      case "??????":
        return "#FECBCB";
      case "????????????":
        return "#FFFFCC";
      case "??????/?????????":
        return "#E6FFCC";
      case "????????????":
        return "#CBFFE6";
      case "?????????/????????????":
        return "#CDFFFE";
      case "??????":
        return "#eeeeee";
    }
  };

  const [contactText, setContactText] = useState();
  const contactTextChange = (e) => {
    setContactText(e.target.value);
  };

  const contactSubmit = (e) => {
    e.preventDefault();
    if (contactText) {
      dbService.collection("userChat").add({
        sendFromId: currentUser.uid,
        sendToId: pageUser.userId,
        chatContent: contactText,
        createdAt: Date.now(),
      });
      setContactOpen(false);
      alert(
        `??????????????? ??????????????????.\n????????? messages ????????? ????????? ??? ????????????!`
      );
    } else {
      alert("???????????? ????????? ?????????!");
    }
  };

  const contactPopUp = (
    <Dialog
      open={contactOpen}
      onClose={() => {
        setContactOpen(false);
      }}
    >
      <DialogTitle>Contact</DialogTitle>
      <DialogContent>
        <DialogContentText>?????? ???????????? ???????????? ??????,</DialogContentText>
        <DialogContentText>????????? ????????? ????????? ?????????.</DialogContentText>
        <DialogContentText sx={{ fontSize: "80%", color: "red" }}>
          ??? ???????????? ??????????????? ?????? ????????? ????????????!
        </DialogContentText>
        <TextField
          required
          autoFocus
          multiline
          rows={6}
          id="chatContent"
          name="chatContent"
          label="Message"
          type="text"
          fullWidth
          variant="outlined"
          onChange={contactTextChange}
          sx={{ mt: "1.5rem", mb: "1rem", minWidth: "30vw" }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          style={{ color: "#AFAFAF" }}
          onClick={() => {
            setContactOpen(false);
          }}
        >
          ??????
        </Button>
        <Button style={{ color: "#5254F3" }} onClick={contactSubmit}>
          ?????????
        </Button>
      </DialogActions>
    </Dialog>
  );

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
              width: "10vw",
              height: "10vw",
              minWidth: "9rem",
              minHeight: "9rem",
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#E7E5FF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            {pageUser.userImage ? (
              <Image
                src={pageUser.userImage}
                alt="profile image"
                width="210%"
                height="210%"
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
                  fontSize: "200%",
                  fontWeight: "600",
                  marginBottom: "2.5vmin",
                }}
              >
                {pageUser.userName}
              </div>
              <span
                style={{
                  fontSize: "100%",
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
                  fontSize: "100%",
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
                <Tooltip
                  sx={{ display: { xs: "none", md: "inherit" } }}
                  title="????????? ????????? ????????? ?????????!"
                  arrow
                >
                  <OutlinedButton onClick={() => setContactOpen(true)}>
                    Contact
                  </OutlinedButton>
                </Tooltip>
              ) : null}
              {contactOpen ? contactPopUp : null}
            </div>
          </div>
        </div>
        <div>
          <NotionRenderer
            recordMap={recordMap}
            fullPage={false}
            mapPageUrl={(path) => `/${pageUser.userLink}/` + path}
            components={{
              collection: Collection,
              collectionRow: CollectionRow,
            }}
          />
        </div>
      </Box>
    </>
  );
}

export default NotionPage;
