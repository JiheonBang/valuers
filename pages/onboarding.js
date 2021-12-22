import React, { useState, useEffect } from "react";
import { authService, dbService } from "../firebase/initFirebase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  ContainedButton,
  TextButton,
  ContainedLoadingButton,
} from "../components/styledButton";

import logobox from "../public/logobox.png";
import onboarding from "../public/onboarding.png";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import PersonIcon from "@mui/icons-material/Person";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

function Onboarding() {
  const user = authService.currentUser;
  const router = useRouter();
  const [numberOnb, setNumberOnb] = useState(1);
  const [findLink, setFindLink] = useState(false);
  const [linkData, setLinkData] = useState([]);
  const [pickedImage, setPickedImage] = useState();
  const [previewURL, setPreviewURL] = useState();
  const [userJob, setUserJob] = useState("");
  const [userCareer, setUserCareer] = useState("");
  const [loading, setLoading] = useState(false);

  const [givenInfo, setGivenInfo] = useState({
    userName: null,
    userLink: null,
    userImage: null,
    userJob: null,
    userCareer: null,
  });

  authService.onAuthStateChanged(async (user) => {
    if (user) {
      const infoSnapshot = await dbService.doc(`userInfo/${user.uid}`).get();
      if (infoSnapshot.exists) {
        router.push(`/loading`);
      }
    }
  });

  useEffect(() => {
    let a = [];
    dbService.collection("userInfo").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => a.push(doc.data().userLink));
      setLinkData(a);
    });
  }, []);

  const onChangeData = (e) => {
    const { id, value } = e.currentTarget;
    setGivenInfo({ ...givenInfo, [id]: value });
  };

  const onPreviousClick = (e) => {
    e.preventDefault();
    setNumberOnb((prev) => prev - 1);
  };

  const onDelayClick = (e) => {
    e.preventDefault();
    setNumberOnb((prev) => prev + 1);
  };

  const onNextClick = (e) => {
    e.preventDefault();
    givenInfo.userName
      ? (e.target.reset(), setNumberOnb((prev) => prev + 1))
      : alert(`필수 항목입니다.\n입력해주세요!`);
  };

  let timer;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (linkData.includes(givenInfo.userLink)) {
      setFindLink(true);
    } else {
      setFindLink(false);
    }
  }, 300);

  const onNextClickLink = (e) => {
    e.preventDefault();

    const regex = /^[a-z|A-Z|0-9]+$/;

    if (givenInfo.userLink) {
      if (regex.test(givenInfo.userLink)) {
        if (!findLink) {
          e.target.reset();
          setNumberOnb((prev) => prev + 1);
        } else {
          alert("중복된 아이디입니다.");
        }
      } else {
        alert("아이디에는 영어와 숫자만 사용 가능합니다.");
      }
    } else {
      alert(`필수 항목입니다.\n아이디를 입력해주세요!`);
    }
  };

  const onFinishClick = async (e) => {
    e.preventDefault();
    if (!(userJob && userCareer)) {
      alert(`필수 항목입니다.\n직무와 경력을 입력해주세요!`);
    } else {
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

      const ok = window.confirm("저장하시겠습니까?");
      if (ok) {
        if (data.secure_url) {
          dbService
            .collection("userInfo")
            .doc(`${user.uid}`)
            .set({
              userId: user.uid,
              userEmail: user.email,
              userName: givenInfo.userName,
              userLink: givenInfo.userLink,
              userImage: data.secure_url,
              userJob: userJob,
              userCareer: userCareer,
              isOnboarding: true,
            })
            .then(() => {
              router.push(`/${givenInfo.userLink}`);
            });
        } else {
          dbService
            .collection("userInfo")
            .doc(`${user.uid}`)
            .set({
              userId: user.uid,
              userEmail: user.email,
              userName: givenInfo.userName,
              userImage: null,
              userLink: givenInfo.userLink,
              userJob: userJob,
              userCareer: userCareer,
              isOnboarding: true,
            })
            .then(() => {
              router.push(`/${givenInfo.userLink}`);
            });
        }
      }
    }
  };

  const progressCircle = (
    <div
      style={{
        width: "10px",
        height: "10px",
        margin: "6px",
        borderRadius: "50%",
        backgroundColor: "#E7E5FF",
      }}
    ></div>
  );

  const currentCircle = (
    <div
      style={{
        width: "12px",
        height: "12px",
        margin: "6px",
        borderRadius: "50%",
        backgroundColor: "#5E54F3",
      }}
    ></div>
  );

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
    setUserJob(e.target.value);
  };
  const changeCareerData = (e) => {
    setUserCareer(e.target.value);
  };

  return (
    <>
      <div
        style={{
          padding: "1.5rem 2rem",
          position: "fixed",
          zIndex: 1,
          cursor: "pointer",
        }}
      >
        <Link href="/" passHref>
          <Image width="125px" height="45px" src={logobox} alt="logobox" />
        </Link>
      </div>
      <Grid container style={{ height: "100vh" }}>
        <Grid
          item
          xs={12}
          md={5}
          sx={{ display: { xs: "none", md: "block" } }}
          style={{
            backgroundColor: "#DDF3FF",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Image src={onboarding} alt="onboarding" />
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          md={7}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {numberOnb === 1 ? (
            <>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "60vmin" },
                }}
                noValidate
                autoComplete="off"
                onSubmit={onNextClick}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "-4rem",
                    marginBottom: "4rem",
                  }}
                >
                  {currentCircle}
                  {progressCircle}
                  {progressCircle}
                  {progressCircle}
                </div>
                <h2>이름을 입력해 주세요.</h2>
                <h5 style={{ color: "#AFAFAF" }}>
                  프로필 상단에 기재될 예정입니다.
                  <div style={{ marginBottom: "5px" }}></div>
                  밸류어스는 실명 사용을 권장합니다.
                </h5>

                <TextField
                  required
                  name="userName"
                  id="userName"
                  label="이름"
                  variant="standard"
                  onChange={onChangeData}
                />
                <div
                  style={{
                    width: "60vmin",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <ContainedButton
                    sx={{
                      width: "fit-content",
                      padding: "1vmin 1vmin",
                      fontSize: "100%",
                    }}
                    type="submit"
                  >
                    다음
                  </ContainedButton>
                </div>
              </Box>
            </>
          ) : numberOnb === 2 ? (
            <>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "60vmin" },
                }}
                noValidate
                autoComplete="off"
                onSubmit={onNextClickLink}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "-4rem",
                    marginBottom: "4rem",
                  }}
                >
                  {progressCircle}
                  {currentCircle}
                  {progressCircle}
                  {progressCircle}
                </div>
                <h2>아이디를 입력해 주세요.</h2>
                <h5 style={{ color: "#AFAFAF" }}>
                  프로필 링크로 사용됩니다! 영어와 숫자만 입력 가능해요.
                  <div style={{ marginBottom: "5px" }}></div>
                  <span style={{ color: "#5E54F3" }}>
                    www.valuers.com/{givenInfo.userLink}
                  </span>
                </h5>
                <TextField
                  required
                  name="userLink"
                  id="userLink"
                  label="아이디"
                  variant="standard"
                  onChange={onChangeData}
                />
                {givenInfo.userLink ? (
                  findLink ? (
                    <div style={{ color: "red" }}>
                      이미 존재하는 아이디입니다.
                    </div>
                  ) : (
                    <div style={{ color: "blue" }}>
                      사용 가능한 아이디입니다.
                    </div>
                  )
                ) : null}

                <Stack
                  spacing={1.5}
                  direction="row"
                  sx={{ width: "60vmin", justifyContent: "flex-end" }}
                >
                  <TextButton
                    style={{
                      width: "fit-content",
                      padding: "1vmin 1vmin",
                      fontSize: "100%",
                      color: "#AFAFAF",
                    }}
                    onClick={onPreviousClick}
                  >
                    이전
                  </TextButton>
                  <ContainedButton
                    style={{
                      width: "fit-content",
                      padding: "1vmin 1vmin",
                      fontSize: "100%",
                      marginLeft: "2vmin",
                    }}
                    variant="outlined"
                    type="submit"
                  >
                    다음
                  </ContainedButton>
                </Stack>
              </Box>
            </>
          ) : numberOnb === 3 ? (
            <>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "60vmin" },
                }}
                noValidate
                autoComplete="off"
                onSubmit={onNextClick}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "-4rem",
                    marginBottom: "4rem",
                  }}
                >
                  {progressCircle}
                  {progressCircle}
                  {currentCircle}
                  {progressCircle}
                </div>
                <h2>프로필 사진을 선택해 주세요.</h2>
                <h5 style={{ color: "#AFAFAF" }}>
                  24X24, PNG, JPG, JPEG
                  <div style={{ marginBottom: "5px" }}></div>
                </h5>
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
                    width: "fit-content",
                    textAlign: "center",
                    fontSize: "100%",
                    color: "#AAAAAA",
                    padding: "1vmin 2vmin",
                    border: "2px solid #AFAFAF",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  upload
                </label>

                <Stack
                  spacing={1.5}
                  direction="row"
                  alignItems="center"
                  sx={{ width: "60vmin", justifyContent: "space-between" }}
                >
                  <TextButton
                    style={{
                      width: "fit-content",
                      padding: "1vmin 1vmin",
                      fontSize: "100%",
                      color: "#AFAFAF",
                    }}
                    onClick={onDelayClick}
                  >
                    다음에 하기
                  </TextButton>
                  <div>
                    <TextButton
                      style={{
                        width: "fit-content",
                        padding: "1vmin 1vmin",
                        fontSize: "100%",
                        color: "#AFAFAF",
                      }}
                      onClick={onPreviousClick}
                    >
                      이전
                    </TextButton>
                    <ContainedButton
                      style={{
                        width: "fit-content",
                        padding: "1vmin 1vmin",
                        fontSize: "100%",
                        marginLeft: "2vmin",
                      }}
                      variant="outlined"
                      type="submit"
                    >
                      다음
                    </ContainedButton>
                  </div>
                </Stack>
              </Box>
            </>
          ) : numberOnb === 4 ? (
            <>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": { m: 1, width: "60vmin" },
                }}
                noValidate
                autoComplete="off"
                onSubmit={onFinishClick}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: "-4rem",
                    marginBottom: "4rem",
                  }}
                >
                  {progressCircle}
                  {progressCircle}
                  {progressCircle}
                  {currentCircle}
                </div>
                <h2>직무와 경력을 선택해 주세요.</h2>
                <h5 style={{ color: "#AFAFAF" }}>
                  근무하고 계신 직무가 없으신 경우,
                  <div style={{ marginBottom: "5px" }}></div>
                  기타를 선택해 주세요!
                </h5>
                <Grid container spacing={3}>
                  <Grid item sx={{ minWidth: "30vmin" }} xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="userJob">직무</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="userJob"
                        value={userJob}
                        label="현재 직무"
                        onChange={changeJobData}
                      >
                        <MenuItem value="대표">대표</MenuItem>
                        <MenuItem value="기획/PM/PO">기획/PM/PO</MenuItem>
                        <MenuItem value="디자인">디자인</MenuItem>
                        <MenuItem value="개발">개발</MenuItem>
                        <MenuItem value="인사관리">인사관리</MenuItem>
                        <MenuItem value="영업/마케팅">영업/마케팅</MenuItem>
                        <MenuItem value="프리랜서">프리랜서</MenuItem>
                        <MenuItem value="대학생/취업준비">
                          대학생/취업준비
                        </MenuItem>
                        <MenuItem value="기타">기타</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item sx={{ minWidth: "30vmin" }} xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="userCareer">경력</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="userCareer"
                        value={userCareer}
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
                  </Grid>
                </Grid>

                <Stack
                  spacing={1.5}
                  direction="row"
                  sx={{ width: "60vmin", justifyContent: "flex-end" }}
                >
                  <TextButton
                    style={{
                      width: "fit-content",
                      padding: "1vmin 1vmin",
                      fontSize: "100%",
                      color: "#AFAFAF",
                    }}
                    onClick={onPreviousClick}
                  >
                    이전
                  </TextButton>
                  <ContainedLoadingButton
                    style={{
                      width: "fit-content",
                      padding: "1vmin 1vmin",
                      fontSize: "100%",
                      marginLeft: "2vmin",
                    }}
                    variant="outlined"
                    type="submit"
                    loading={loading}
                  >
                    완료
                  </ContainedLoadingButton>
                </Stack>
              </Box>
            </>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
}

export default Onboarding;
