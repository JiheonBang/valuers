// import { NotionRenderer } from "react-notion";
import { dbService, authService } from "../firebase/initFirebase";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";

import {
  ContainedButton,
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
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { NotionAPI } from "notion-client";
import { NotionRenderer, Collection, CollectionRow } from "react-notion-x";

function UserLink({ pageUser, notionUser, notionRes }) {
  const [currentUser, setCurrentUser] = useState(pageUser);
  const [recordMap, setRecordMap] = useState();
  const [clickedPersona, setClickedPersona] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  });

  useEffect(() => {
    notionRes.map((item) => {
      if (item.personaIndex === clickedPersona) {
        setRecordMap(item.personaNotion);
      }
    });
  });

  const indexData = notionUser.map((item) => item.personaIndex);
  const maxNum = (list) => {
    let max;
    if (list.length !== 0) {
      max = list[0];
      for (let i = 0; i < list.length; i++) {
        if (list[i] > max) max = list[i];
      }
    } else {
      max = 0;
    }
    return max;
  };

  const [selectValue, setSelectValue] = useState();
  const onClickPersona = (id) => {
    setClickedPersona(id);
    notionUser.map((item) => {
      item.personaIndex === id && setSelectValue(item.personaText);
    });
  };

  const [textValue, setTextValue] = useState();
  const [notionValue, setNotionValue] = useState();
  const [colorValue, setColorValue] = useState();
  const addClick = () => {
    setTextValue("");
    setNotionValue("");
    setColorValue("");
    notionUser.length > 4
      ? alert("?????? ????????? ??????????????? 5?????? ???????????????.")
      : setAddOpen(!addOpen);
  };

  const addTextChange = (e) => {
    if (e.target.name === "personaText") {
      setTextValue(e.target.value);
    } else if (e.target.name === "personaNotion") {
      setNotionValue(e.target.value);
    } else if (e.target.name === "personaColor") {
      setColorValue(e.target.value);
    }
  };

  const addSubmit = (e) => {
    e.preventDefault();
    textValue && notionValue
      ? dbService
          .collection("userData")
          .add({
            userId: pageUser.userId,
            personaIndex: maxNum(indexData) + 1,
            personaText: textValue,
            personaNotion: notionValue,
            personaColor: colorValue,
          })
          .then(() => {
            fetch(process.env.NEXT_PUBLIC_SLACK_CONFIG_NOTION, {
              method: "POST",
              body: JSON.stringify({ text: "User added Notion Data!" }),
            });
          })
          .then(setAddOpen(false))
          .then((res) => window.location.reload())
      : alert("??? ????????? ?????? ????????? ????????? ?????????!");
  };

  const deleteNotion = (id) => {
    const ok = window.confirm("?????? ??????????????????????");
    if (ok) {
      notionUser.map((item) => {
        item.personaIndex === +id
          ? dbService
              .collection("userData")
              .doc(item.id)
              .delete()
              .then(() => {
                fetch(process.env.NEXT_PUBLIC_SLACK_CONFIG_NOTION, {
                  method: "POST",
                  body: JSON.stringify({ text: "User deleted Notion Data!" }),
                });
              })
              .then((res) => window.location.reload())
          : null;
      });
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
        userId: currentUser.uid,
      });
      setContactOpen(false);
      alert(
        `??????????????? ??????????????????.\n????????? messages ????????? ????????? ??? ????????????!`
      );
    } else {
      alert("???????????? ????????? ?????????!");
    }
  };

  const addPopUp = (
    <Dialog
      open={addOpen}
      onClose={() => {
        setAddOpen(false);
      }}
    >
      <DialogTitle>Notion ????????????</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ?????? ???????????? ????????? ?????? ????????? ????????? ?????????.
        </DialogContentText>
        <TextField
          required
          autoFocus
          margin="dense"
          id="personaText"
          name="personaText"
          label="Tab Text"
          type="text"
          fullWidth
          variant="outlined"
          onChange={addTextChange}
          style={{ marginBottom: "2rem" }}
        />

        <DialogContentText>?????? ?????? ????????? ????????? ?????????.</DialogContentText>
        <DialogContentText>
          [?????? ????????????]??? ????????? ???????????? ?????????!
        </DialogContentText>
        <span style={{ fontSize: "80%" }}>
          ??????: notion.site/Introduce-186b18f095e044e2a68fe99fb53fea3d
        </span>
        <TextField
          required
          autoFocus
          margin="dense"
          id="personaNotion"
          name="personaNotion"
          label="Tab Notion"
          type="text"
          fullWidth
          variant="outlined"
          onChange={addTextChange}
          style={{ marginBottom: "2rem" }}
        />
        <DialogContentText>
          ?????? Tab??? ??????????????? ??? ????????? ????????? ?????? ?????????.
        </DialogContentText>

        <TextField
          required
          autoFocus
          margin="dense"
          id="personaColor"
          name="personaColor"
          label="Tab Color"
          type="color"
          fullWidth
          variant="outlined"
          onChange={addTextChange}
          defaultValue="#0B132A"
        />
      </DialogContent>
      <DialogActions>
        <Button
          style={{ color: "#AFAFAF" }}
          onClick={() => {
            setAddOpen(false);
          }}
        >
          ??????
        </Button>
        <Button style={{ color: "#5254F3" }} onClick={addSubmit}>
          ????????????
        </Button>
      </DialogActions>
    </Dialog>
  );

  const modifyPopUp = (
    <Dialog
      open={modifyOpen}
      onClose={() => {
        setModifyOpen(false);
      }}
    >
      <DialogTitle>Tab ????????????</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ????????????????????????, ????????? ????????? ???????????????.????
        </DialogContentText>
        <DialogContentText>
          ????????? ???????????? ?????? ?????? ??? ?????? ????????? ?????????.
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: "0.7rem" }}>
          [ Tabs ]
        </DialogContentText>
        <Divider />
        {notionUser.length === 0 ? (
          <DialogContentText sx={{ marginTop: "0.5rem" }}>
            ?????? ????????? ?????? ????????????.
          </DialogContentText>
        ) : (
          <DialogContentText>
            {notionUser.map((item) => (
              <>
                <DialogContentText
                  key={item.personaIndex}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.7rem",
                    color: item.personaColor,
                  }}
                >
                  {item.personaText}
                  <button
                    id={item.personaIndex}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "inherit",
                      border: "none",
                    }}
                    onClick={(e) => deleteNotion(e.currentTarget.id)}
                  >
                    <DeleteIcon
                      id={item.personaIndex}
                      sx={{ color: "#AFAFAF" }}
                    />
                  </button>
                </DialogContentText>
                <Divider />
              </>
            ))}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          style={{ color: "#AFAFAF" }}
          onClick={() => {
            setModifyOpen(false);
          }}
        >
          ??????
        </Button>
      </DialogActions>
    </Dialog>
  );

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
            </div>
            {contactOpen ? contactPopUp : null}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: { xs: "none", md: "inherit" } }}>
            {notionUser.map((item) => (
              <PersonaButton
                key={item.personaIndex}
                onClick={() => onClickPersona(item.personaIndex)}
                sx={
                  clickedPersona === item.personaIndex
                    ? {
                        color: item.personaColor,
                        borderBottom: `2px solid ${item.personaColor}`,
                        borderRadius: "0px",
                        // display: { xs: "none" },
                      }
                    : null
                }
              >
                {item.personaText}
              </PersonaButton>
            ))}
          </Box>
          <Box
            sx={{
              display: { md: "none", xs: "flex" },
              width: "100vw",
              marginTop: "1rem",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="personaTab">?????? ????????? ?????????.</InputLabel>
              <Select
                labelId="tab-selector"
                id="personaTab"
                value={selectValue}
                label="?????? ????????? ?????????."
                onChange={(e) => setClickedPersona(e.target.value)}
              >
                {notionUser &&
                  notionUser.map((item) => (
                    <MenuItem
                      key={item.personaIndex}
                      value={item.personaIndex}
                      sx={{ color: item.personaColor }}
                    >{`${item.personaText}`}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            {currentUser && currentUser.uid !== pageUser.userId ? (
              <Tooltip
                sx={{ display: { md: "none" } }}
                title="????????? ????????? ????????? ?????????!"
                arrow
              >
                <ContainedButton
                  sx={{
                    fontSize: "100%",
                    marginLeft: "15px",
                    height: "fit-content",
                    padding: "0.5rem 0",
                  }}
                  onClick={() => setContactOpen(true)}
                >
                  Contact
                </ContainedButton>
              </Tooltip>
            ) : null}
          </Box>
          <div>
            {currentUser && currentUser.uid === pageUser.userId ? (
              <>
                <Tooltip title="?????? ????????????" arrow>
                  <PersonaButton2
                    onClick={addClick}
                    sx={{ marginRight: "-1rem", padding: 0 }}
                  >
                    +
                  </PersonaButton2>
                </Tooltip>
                {addOpen ? addPopUp : null}
                <Tooltip title="??? ????????????" arrow>
                  <PersonaButton2 onClick={() => setModifyOpen(true)}>
                    ...
                  </PersonaButton2>
                </Tooltip>
                {modifyOpen ? modifyPopUp : null}
              </>
            ) : null}
          </div>
        </div>
        <div>
          {currentUser && currentUser.uid === pageUser.userId ? (
            notionUser.length === 0 ? (
              <Grid container sx={{ height: "40vh" }}>
                <Grid
                  item
                  xs={12}
                  md={7}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h2>????????? ????????? ?????????!</h2>
                  <h3 style={{ fontWeight: "400", marginTop: "-0.3vmin" }}>
                    ?????? ???????????? ?????? ?????????????
                  </h3>
                  <OutlinedButton onClick={addClick}>
                    ?????? ????????????
                  </OutlinedButton>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h3>?????? ?????????????????? ????????????????</h3>
                  <ContainedButton>
                    <a
                      href="https://ossified-language-542.notion.site/Valuers-46e2fe1f4c4d4626b46d79b6125c7fe0"
                      target="_blank"
                      rel="noreferrer"
                    >
                      ????????? ????????????
                    </a>
                  </ContainedButton>
                </Grid>
              </Grid>
            ) : (
              <NotionRenderer
                recordMap={recordMap}
                fullPage={false}
                mapPageUrl={(path) => `/${pageUser.userLink}/` + path}
                components={{
                  collection: Collection,
                  collectionRow: CollectionRow,
                }}
              />
            )
          ) : (
            <NotionRenderer
              recordMap={recordMap}
              fullPage={false}
              mapPageUrl={(path) => `/${pageUser.userLink}/` + path}
              components={{
                collection: Collection,
                collectionRow: CollectionRow,
              }}
            />
          )}
        </div>
      </Box>
    </>
  );
}

export default UserLink;

export async function getServerSideProps(context) {
  const givenLink = context.params.userLink;

  const linkDataSet = [];
  const userData = await dbService.collection("userInfo").get();
  userData.forEach((doc) =>
    doc.data().userLink === givenLink ? linkDataSet.push(doc.data()) : null
  );

  const notionDataSet = [];
  const notionData = await dbService
    .collection("userData")
    .orderBy("personaIndex")
    .get();
  notionData.forEach((doc) => {
    doc.data() && doc.data().userId === linkDataSet[0].userId
      ? notionDataSet.push({ id: doc.id, ...doc.data() })
      : null;
  });

  const notion = new NotionAPI();
  let notionRes = [];
  for (let i = 0; i < notionDataSet.length; i++) {
    const notionFetch = await notion.getPage(
      notionDataSet[i].personaNotion
        .split("/")
        .reverse()[0]
        .split("-")
        .reverse()[0]
    );
    notionRes.push({
      personaIndex: notionDataSet[i].personaIndex,
      personaText: notionDataSet[i].personaText,
      personaColor: notionDataSet[i].personaColor,
      userId: notionDataSet[i].userId,
      personaNotion: notionFetch,
    });
  }

  return {
    props: {
      key: givenLink,
      pageUser: linkDataSet[0],
      notionUser: notionDataSet && notionDataSet,
      notionRes: notionRes && notionRes,
    },
  };
}
