import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/sidebar";
import { authService, dbService } from "../firebase/initFirebase";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";

import { ContainedButton } from "../components/styledButton";
import message1 from "../public/message1.png";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import OutboundOutlinedIcon from "@mui/icons-material/OutboundOutlined";

export default function Message() {
  const [currentUser, setCurrentUser] = useState();

  const router = useRouter();

  authService.onAuthStateChanged(async (user) => {
    if (user) {
      setCurrentUser(user);
      const infoSnapshot = await dbService.doc(`userInfo/${user.uid}`).get();
      if (!infoSnapshot.exists) {
        router.push(`/loading`);
      }
    } else {
      router.push("/");
    }
  });

  const [chatData, setChatData] = useState([]);
  const [msgId, setMsgId] = useState([]);
  useEffect(() => {
    dbService
      .collection("userChat")
      .orderBy("createdAt")
      .onSnapshot((snapshot) => {
        const chatDB = snapshot.docs.map((doc) =>
          doc.data().sendFromId === currentUser.uid ||
          doc.data().sendToId === currentUser.uid
            ? { ...doc.data(), id: doc.id }
            : {}
        );
        setChatData(chatDB);
        let idDB = [];
        chatDB
          ? chatDB.map((item) => {
              if (item.sendFromId === currentUser.uid) {
                idDB.push(item.sendToId);
              } else if (item.sendToId === currentUser.uid) {
                idDB.push(item.sendFromId);
              }
            })
          : null;
        const uniqueIdDB = Array.from(new Set(idDB));
        setMsgId(uniqueIdDB);
      });
  }, []);

  const [msgInfo, setMsgInfo] = useState();

  const getName = async () => {
    const getDB = await Promise.all(
      msgId.map(async (item) => {
        const infoDB = await dbService.doc(`userInfo/${item}`).get();
        return {
          userName: infoDB.data().userName,
          userId: infoDB.data().userId,
          userLink: infoDB.data().userLink,
        };
      })
    );
    setMsgInfo(getDB);
  };

  useEffect(() => {
    getName();
  }, [msgId]);

  const [value, setValue] = useState(-1);
  const [selectValue, setSelectValue] = useState();
  const [currentTab, setCurrentTab] = useState();

  const tabChange = (event, newValue) => {
    setCurrentTab(event.target.id);
    setValue(newValue);
  };

  const selectChange = (event) => {
    setCurrentTab(event.target.value);
    setSelectValue(event.target.value);
  };

  const [newChat, setNewChat] = useState();
  const chatChange = (e) => {
    setNewChat(e.target.value);
  };

  const chatSubmit = (e) => {
    e.preventDefault();
    setNewChat("");
    dbService.collection("userChat").add({
      chatContent: newChat,
      sendFromId: currentUser.uid,
      sendToId: currentTab,
      createdAt: Date.now(),
      userId: currentUser.uid,
    });
  };

  const messageBoxRef = useRef();
  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  const getChattings = () => {
    let rawChattings = [];
    chatData.map((item) => {
      item.sendFromId && item.sendFromId === currentTab
        ? rawChattings.push({ ...item, type: "get" })
        : item.sendToId && item.sendToId === currentTab
        ? rawChattings.push({ ...item, type: "send" })
        : null;
    });

    let chatLink;
    msgInfo &&
      msgInfo.map((item) => {
        item.userId === currentTab ? (chatLink = item.userLink) : null;
      });

    return (
      <>
        {chatData.length !== 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100vw",
            }}
          >
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "70vh",
                  overflow: "scroll",
                }}
                ref={messageBoxRef}
              >
                {rawChattings.map((item) => (
                  <div key={item.createdAt} className={`block_${item.type}`}>
                    <div className={item.type}>{item.chatContent}</div>
                    <div
                      style={{
                        margin: "-10px 15px 0px 15px",
                        fontSize: "80%",
                        color: "#afafaf",
                      }}
                    >
                      {moment(item.createdAt).format("MM/DD HH:mm")}
                    </div>
                  </div>
                ))}
              </Box>
              {currentTab && (
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "80%" },
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={chatSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {chatLink && (
                    <Link href={`/${chatLink}`} passHref>
                      <a style={{ width: "25px", textAlign: "center" }}>
                        <Tooltip title="프로필 보러 가기" arrow>
                          <IconButton>
                            <OutboundOutlinedIcon sx={{ color: "#5254F3" }} />
                          </IconButton>
                        </Tooltip>
                      </a>
                    </Link>
                  )}
                  <TextField
                    required
                    name="chatContent"
                    id="chatContent"
                    value={newChat}
                    index={currentTab}
                    onChange={chatChange}
                  />

                  <ContainedButton
                    style={{
                      width: "1vmin",
                      padding: "1vmin 1vmin",
                      fontSize: "2vmin",
                    }}
                    type="submit"
                  >
                    보내기
                  </ContainedButton>
                </Box>
              )}
            </>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h2 style={{ marginTop: "10vh", color: "#afafaf" }}>
              아직 메시지가 없습니다.
            </h2>
            <h4
              style={{
                marginTop: "-1vh",
                marginBottom: "-3vh",
                color: "#afafaf",
              }}
            >
              메시지를 보내 새로운 기회를 만들어 보세요.
            </h4>
            <div style={{ width: "60%" }}>
              <Image src={message1} alt="message1" />
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: "100%", md: "65%" },
          ml: { md: "25%" },
          mr: { md: "10%" },
        }}
      >
        <h1>Messages</h1>
        <Divider />
        <FormControl fullWidth sx={{ display: { md: "none" } }}>
          <InputLabel id="chattings">채팅 상대를 골라주세요.</InputLabel>
          <Select
            labelId="chat-selector"
            id="chattings"
            value={selectValue}
            label="채팅 상대를 선택해 주세요."
            onChange={selectChange}
          >
            {msgInfo &&
              msgInfo.map((item) => (
                <MenuItem
                  key={item.userId}
                  value={item.userId}
                >{`${item.userName} 님`}</MenuItem>
              ))}
          </Select>
        </FormControl>
        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            display: "flex",
            height: "75vh",
          }}
        >
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={tabChange}
            aria-label="Vertical tabs"
            sx={{
              borderRight: 1,
              borderColor: "divider",
              width: { md: "13vw" },
              display: { xs: "none", md: "inherit" },
            }}
          >
            {msgInfo &&
              msgInfo.map((item) => (
                <Tab
                  key={item.userId}
                  id={item.userId}
                  label={`${item.userName} 님`}
                />
              ))}
          </Tabs>
          {getChattings()}
        </Box>
      </Box>
    </>
  );
}
