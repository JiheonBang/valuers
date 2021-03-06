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
      : alert(`?????? ???????????????.\n??????????????????!`);
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
          alert("????????? ??????????????????.");
        }
      } else {
        alert("??????????????? ????????? ????????? ?????? ???????????????.");
      }
    } else {
      alert(`?????? ???????????????.\n???????????? ??????????????????!`);
    }
  };

  const onFinishClick = async (e) => {
    e.preventDefault();
    if (!(userJob && userCareer)) {
      alert(`?????? ???????????????.\n????????? ????????? ??????????????????!`);
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

      const ok = window.confirm("?????????????????????????");
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
                <h2>????????? ????????? ?????????.</h2>
                <h5 style={{ color: "#AFAFAF" }}>
                  ????????? ????????? ????????? ???????????????.
                  <div style={{ marginBottom: "5px" }}></div>
                  ??????????????? ?????? ????????? ???????????????.
                </h5>

                <TextField
                  required
                  name="userName"
                  id="userName"
                  label="??????"
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
                    ??????
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
                <h2>???????????? ????????? ?????????.</h2>
                <h5 style={{ color: "#AFAFAF" }}>
                  ????????? ????????? ???????????????! ????????? ????????? ?????? ????????????.
                  <div style={{ marginBottom: "5px" }}></div>
                  <span style={{ color: "#5E54F3" }}>
                    www.valuers.com/{givenInfo.userLink}
                  </span>
                </h5>
                <TextField
                  required
                  name="userLink"
                  id="userLink"
                  label="?????????"
                  variant="standard"
                  onChange={onChangeData}
                />
                {givenInfo.userLink ? (
                  findLink ? (
                    <div style={{ color: "red" }}>
                      ?????? ???????????? ??????????????????.
                    </div>
                  ) : (
                    <div style={{ color: "blue" }}>
                      ?????? ????????? ??????????????????.
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
                    ??????
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
                    ??????
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
                <h2>????????? ????????? ????????? ?????????.</h2>
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
                    ????????? ??????
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
                      ??????
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
                      ??????
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
                <h2>????????? ????????? ????????? ?????????.</h2>
                <h5 style={{ color: "#AFAFAF" }}>
                  ???????????? ?????? ????????? ????????? ??????,
                  <div style={{ marginBottom: "5px" }}></div>
                  ????????? ????????? ?????????!
                </h5>
                <Grid container spacing={3}>
                  <Grid item sx={{ minWidth: "30vmin" }} xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="userJob">??????</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="userJob"
                        value={userJob}
                        label="?????? ??????"
                        onChange={changeJobData}
                      >
                        <MenuItem value="??????">??????</MenuItem>
                        <MenuItem value="??????/PM/PO">??????/PM/PO</MenuItem>
                        <MenuItem value="?????????">?????????</MenuItem>
                        <MenuItem value="??????">??????</MenuItem>
                        <MenuItem value="????????????">????????????</MenuItem>
                        <MenuItem value="??????/?????????">??????/?????????</MenuItem>
                        <MenuItem value="????????????">????????????</MenuItem>
                        <MenuItem value="?????????/????????????">
                          ?????????/????????????
                        </MenuItem>
                        <MenuItem value="??????">??????</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item sx={{ minWidth: "30vmin" }} xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="userCareer">??????</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="userCareer"
                        value={userCareer}
                        label="??????"
                        onChange={changeCareerData}
                      >
                        <MenuItem value="?????? ???">?????? ???</MenuItem>
                        <MenuItem value="0~1??? ???">0~1??? ???</MenuItem>
                        <MenuItem value="2~3??? ???">2~3??? ???</MenuItem>
                        <MenuItem value="4~6??? ???">4~6??? ???</MenuItem>
                        <MenuItem value="7??? ??? ??????">7??? ??? ??????</MenuItem>
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
                    ??????
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
                    ??????
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
