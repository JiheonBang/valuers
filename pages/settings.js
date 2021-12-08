import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { authService, dbService } from "../firebase/initFirebase";
import { ContainedButton } from "../components/styledButton";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import PersonIcon from "@mui/icons-material/Person";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export default function Settings({ userData }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  const [findLink, setFindLink] = useState();
  const [linkData, setLinkData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickedImage, setPickedImage] = useState();
  const [previewURL, setPreviewURL] = useState();
  const [userInfo, setUserInfo] = useState({
    userName: "",
    userLink: "",
    userJob: "",
    userCareer: "",
    userImage: null,
  });
  const [givenLink, setGivenLink] = useState();

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        userData.map((item) => {
          item.userId === user.uid
            ? (setUserInfo(item), setGivenLink(item.userLink))
            : null;
        });
      }
    });
  }, [userData]);

  useEffect(() => {
    let a = [];
    dbService.collection("userInfo").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => a.push(doc.data().userLink));
      setLinkData(a);
    });
  }, []);

  let timer;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (givenLink !== userInfo.userLink) {
      if (linkData.includes(userInfo.userLink)) {
        setFindLink(true);
      } else {
        setFindLink(false);
      }
    } else {
      setFindLink(false);
    }
  }, 300);

  const onChangeData = (e) => {
    const { id, value } = e.currentTarget;
    setUserInfo({ ...userInfo, [id]: value });
  };

  const changeImage = async (e) => {
    setPickedImage(e.target.files[0]);
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onloadend = () => {
      const givenURL = reader.result;
      setPreviewURL(givenURL);
    };
  };

  const changeJobData = (e) => {
    setUserInfo({ ...userInfo, userJob: e.target.value });
  };
  const changeCareerData = (e) => {
    setUserInfo({ ...userInfo, userCareer: e.target.value });
  };

  const onFinishClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("file", pickedImage);
    formData.append("upload_preset", "userImage");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/valuers/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((res) => res.json());
    if (findLink) {
      alert("링크를 다시 한 번 확인해 주세요!");
    } else {
      const ok = window.confirm("저장하시겠습니까?");
      if (ok) {
        if (data.secure_url) {
          dbService
            .collection("userInfo")
            .doc(`${currentUser.uid}`)
            .update({
              userId: currentUser.uid,
              userEmail: currentUser.email,
              userName: userInfo.userName,
              userLink: userInfo.userLink,
              userImage: data.secure_url,
              userJob: userInfo.userJob,
              userCareer: userInfo.userCareer,
              isOnboarding: true,
            })
            .then(() => {
              router.push(`/${userInfo.userLink}`);
            });
        } else {
          dbService
            .collection("userInfo")
            .doc(`${currentUser.uid}`)
            .update({
              userId: currentUser.uid,
              userEmail: currentUser.email,
              userName: userInfo.userName,
              userImage: userInfo.userImage,
              userLink: userInfo.userLink,
              userJob: userInfo.userJob,
              userCareer: userInfo.userCareer,
              isOnboarding: true,
            })
            .then(() => {
              router.push(`/${userInfo.userLink}`);
            });
        }
      }
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: "100%", md: "65%" },
        ml: { md: `25%` },
      }}
    >
      <Grid container style={{ height: "80vh" }}>
        <Grid item xs={12} md={12} sx={{ mt: { md: "8vh" } }}>
          <div style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
            프로필 정보 변경
          </div>
          <Divider />
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#E7E5FF",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {previewURL ? (
              <Image
                width="150px"
                height="150px"
                src={previewURL}
                alt="photo"
              />
            ) : userInfo.userImage ? (
              <Image
                width="150px"
                height="150px"
                src={userInfo.userImage}
                alt="photo"
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
          <input
            onChange={changeImage}
            name="userImage"
            id="userImage"
            type="file"
            accept=".png, .jpg, .jpeg"
            style={{ display: "none" }}
          ></input>
          <label
            htmlFor="userImage"
            style={{
              width: "13vmin",
              textAlign: "center",
              fontSize: "2vmin",
              color: "#AAAAAA",
              padding: "1vmin",
              marginTop: "1rem",
              border: "2px solid #AFAFAF",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            upload
          </label>
        </Grid>
        <Grid
          item
          xs={12}
          md={7}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            required
            name="userName"
            id="userName"
            label="이름"
            variant="outlined"
            onChange={onChangeData}
            value={userInfo.userName}
            sx={{ width: "50vmin", margin: "2rem 0rem" }}
          />
          <div style={{ color: "red", marginBottom: "2rem" }}>
            <TextField
              required
              name="userLink"
              id="userLink"
              label="링크"
              variant="outlined"
              onChange={onChangeData}
              value={userInfo.userLink}
              sx={{ width: "50vmin" }}
            />
            {userInfo.userLink !== givenLink ? (
              findLink ? (
                <div style={{ color: "red" }}>이미 존재하는 링크입니다.</div>
              ) : (
                <div style={{ color: "blue" }}>사용 가능한 링크입니다.</div>
              )
            ) : null}
          </div>
          <Stack spacing={4} direction="column" sx={{ mb: "2rem" }}>
            <Box sx={{ width: "50vmin" }}>
              <FormControl fullWidth>
                <InputLabel id="userJob">직무</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="userJob"
                  name="userJob"
                  value={userInfo.userJob}
                  label="직무"
                  onChange={changeJobData}
                >
                  <MenuItem value="대표">대표</MenuItem>
                  <MenuItem value="기획/PM/PO">기획/PM/PO</MenuItem>
                  <MenuItem value="디자인">디자인</MenuItem>
                  <MenuItem value="개발">개발</MenuItem>
                  <MenuItem value="인사관리">인사관리</MenuItem>
                  <MenuItem value="영업/마케팅">영업/마케팅</MenuItem>
                  <MenuItem value="대학생/취업준비">대학생/취업준비</MenuItem>
                  <MenuItem value="기타">기타</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: "50vmin" }}>
              <FormControl fullWidth>
                <InputLabel id="userCareer">경력</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="userCareer"
                  name="userCareer"
                  value={userInfo.userCareer}
                  label="경력"
                  onChange={changeCareerData}
                >
                  <MenuItem value="취업 전">취업 전</MenuItem>
                  <MenuItem value="0~1년 차">0~1년 차</MenuItem>
                  <MenuItem value="2~3년 차">2~3년 차</MenuItem>
                  <MenuItem value="4~6년 차">4~6년 차</MenuItem>
                  <MenuItem value="7년 차 이상">7년 차 이상</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
          <div style={{ marginLeft: "35vmin" }}>
            <ContainedButton onClick={onFinishClick}>update</ContainedButton>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}

export async function getStaticProps() {
  let userDataSet = [];
  const userData = await dbService.collection("userInfo").get();
  userData.forEach((doc) => userDataSet.push(doc.data()));

  return {
    props: {
      key: userDataSet[0].userId,
      userData: userDataSet,
    },
    revalidate: 1,
  };
}
