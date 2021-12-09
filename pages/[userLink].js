import { NotionRenderer } from "react-notion";
import { dbService, authService } from "../firebase/initFirebase";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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

function UserLink({ pageUser, notionUser }) {
  const [currentUser, setCurrentUser] = useState(pageUser);
  const [response, setResponse] = useState({});
  const [clickedPersona, setClickedPersona] = useState(1);
  const [addPopUp, setAddPopUp] = useState(false);
  const [userNotionData, setUserNotionData] = useState([]);

  const getData = () => {
    let b = [];
    notionUser.map((item) => {
      const NOTION_PAGE_ID = item.personaNotion;
      fetch(`https://notion-api.splitbee.io/v1/page/${NOTION_PAGE_ID}`)
        .then((res) => res.json())
        .then((resJson) => {
          b.push({ id: item.personaIndex, res: resJson });
        });
      setUserNotionData(b);
    });
  };

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  });

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    userNotionData.map((item) => {
      if (item.id === clickedPersona) {
        setResponse(item.res);
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

  const onClickPersona = (id) => {
    setClickedPersona(id);
  };

  const [textValue, setTextValue] = useState();
  const [notionValue, setNotionValue] = useState();
  const [colorValue, setColorValue] = useState();
  const onPlusClick = () => {
    setTextValue("");
    setNotionValue("");
    setColorValue("");
    notionUser.length > 5
      ? alert("페르소나는 5개가 최대입니다.")
      : setAddPopUp(!addPopUp);
  };

  const popUpTextChange = (e) => {
    if (e.target.name === "personaText") {
      setTextValue(e.target.value);
    } else if (e.target.name === "personaNotion") {
      setNotionValue(e.target.value);
    } else if (e.target.name === "personaColor") {
      setColorValue(e.target.value);
    }
  };

  const popUpSubmit = (e) => {
    e.preventDefault();
    notionValue
      ? dbService
          .collection("userData")
          .add({
            userId: pageUser.userId,
            personaIndex: maxNum(indexData) + 1,
            personaText: textValue,
            personaNotion: notionValue,
            personaColor: colorValue,
          })
          .then(setAddPopUp(false))
          .then((res) => window.location.reload())
      : setAddPopUp(false);
  };

  const plusPopUp = (
    <Dialog
      open={addPopUp}
      onClose={() => {
        setAddPopUp(false);
      }}
    >
      <DialogTitle>Notion 추가하기</DialogTitle>
      <DialogContent>
        <DialogContentText>
          해당 데이터가 들어갈 탭의 이름을 작성해 주세요.
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
          onChange={popUpTextChange}
          style={{ marginBottom: "2rem" }}
        />

        <DialogContentText>
          노션 링크의 가장 마지막 뭉치를 입력해 주세요.
        </DialogContentText>
        <span style={{ fontSize: "80%" }}>
          예시: notion.site/Introduce-Goal-
        </span>
        <span style={{ color: "white", background: "#5452F3" }}>
          186b18f095e044e2a68fe99fb53fea3d
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
          onChange={popUpTextChange}
          style={{ marginBottom: "2rem" }}
        />
        <DialogContentText>
          해당 Tab이 클릭되었을 때 변경될 색상을 골라 주세요.
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
          onChange={popUpTextChange}
          defaultValue="#0B132A"
        />
      </DialogContent>
      <DialogActions>
        <Button
          style={{ color: "#AFAFAF" }}
          onClick={() => {
            setAddPopUp(false);
          }}
        >
          취소
        </Button>
        <Button style={{ color: "#5254F3" }} onClick={popUpSubmit}>
          등록하기
        </Button>
      </DialogActions>
    </Dialog>
  );

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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            {notionUser.map((item) => (
              <PersonaButton
                key={item.personaIndex}
                onClick={() => onClickPersona(item.personaIndex)}
                style={
                  clickedPersona === item.personaIndex
                    ? {
                        color: item.personaColor,
                        borderBottom: `2px solid ${item.personaColor}`,
                        borderRadius: "0px",
                      }
                    : null
                }
              >
                {item.personaText}
              </PersonaButton>
            ))}
          </div>

          <div>
            {currentUser && currentUser.uid === pageUser.userId ? (
              <>
                <PersonaButton2
                  onClick={onPlusClick}
                  style={{ marginRight: "-1rem" }}
                >
                  +
                </PersonaButton2>
                {addPopUp ? plusPopUp : null}
                <Tooltip title="열심히 준비 중입니다!" arrow>
                  <PersonaButton2 style={{ cursor: "not-allowed" }}>
                    ...
                  </PersonaButton2>
                </Tooltip>
              </>
            ) : null}
          </div>
        </div>

        <div>
          <NotionRenderer
            // blockMap={staticResponse}
            blockMap={response}
            fullPage={false}
            customBlockComponents={{
              page: ({ blockValue, renderComponent }) => (
                <Link href={`/${pageUser.userLink}/${blockValue.id}`}>
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

export default UserLink;

export async function getStaticProps(context) {
  const linkDataSet = [];
  const givenLink = context.params.userLink;
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
      ? notionDataSet.push(doc.data())
      : null;
  });

  return {
    props: {
      key: linkDataSet[0].userId,
      pageUser: linkDataSet[0],
      notionUser: notionDataSet && notionDataSet,
    },
    fallback: true,
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const userPaths = [];
  const userLinks = await dbService.collection("userInfo").get();
  userLinks.forEach((doc) => userPaths.push(doc.data()));

  const paths = userPaths.map((item) => `/${item.userLink}`);

  return {
    paths: paths,
    fallback: false,
  };
}
