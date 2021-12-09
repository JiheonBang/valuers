import React, { useState } from "react";
import firebase, { authService, dbService } from "../firebase/initFirebase";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import auth1 from "../public/auth1.png";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { ContainedButton, TextButton } from "../components/styledButton";
import logobox from "../public/logobox.png";
import Chip from "@mui/material/Chip";
import googleLogo from "../public/google_logo_2_littledeep.png";

function Signup() {
  const router = useRouter();
  authService.onAuthStateChanged(async (user) => {
    if (user) {
      const infoSnapshot = await dbService.doc(`userInfo/${user.uid}`).get();
      if (infoSnapshot.exists) {
        router.push(`/loading`);
      }
    }
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [isMatched, setIsMatched] = useState(false);

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "checkPassword") {
      setCheckPassword(value);
    }
  };

  let timer;
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    if (password === checkPassword) {
      setIsMatched(true);
    } else {
      setIsMatched(false);
    }
  }, 300);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (isMatched) {
      try {
        await authService
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            router.push("/loading");
          });
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("비밀번호를 확인해 주세요.");
    }
  };

  const uiConfig = {
    signInSuccessUrl: "/loading",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    signInFlow: "popup",
  };

  const socialClick = async (event) => {
    event.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    await authService.signInWithPopup(provider).then(() => {
      router.push("/loading");
    });
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
            backgroundColor: "#FFF9E5",
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
            <Image src={auth1} alt="auth1" />
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
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: "230%",
              marginBottom: "1rem",
              width: "65vmin",
              textAlign: "start",
            }}
          >
            환영합니다 🙌
          </div>
          <button
            onClick={socialClick}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "65vmin",
              padding: "2vmin 4vmin",
              cursor: "pointer",
              backgroundColor: "#ffffff",
              border: "0.5px solid #e1e1e1",
              borderRadius: "10px",
              marginBottom: "1rem",
            }}
          >
            <Image
              width="18px"
              height="18px"
              src={googleLogo}
              alt="googleLogo"
            />
            <span style={{ fontSize: "16px", marginLeft: "1rem" }}>
              Continue with Google
            </span>
          </button>
          <Divider>
            <Chip label="or" />
          </Divider>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "65vmin" },
            }}
            noValidate
            autoComplete="off"
            onSubmit={onSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              required
              name="email"
              id="outlined-basic"
              label="이메일"
              variant="outlined"
              value={email}
              onChange={onChange}
            />
            <TextField
              required
              name="password"
              type="password"
              id="outlined-basic"
              label="비밀번호"
              variant="outlined"
              value={password}
              onChange={onChange}
            />
            <TextField
              required
              name="checkPassword"
              type="password"
              id="outlined-basic"
              label="비밀번호 확인"
              variant="outlined"
              value={checkPassword}
              onChange={onChange}
            />
            {checkPassword ? (
              isMatched ? (
                <span style={{ color: "blue" }}>일치합니다.</span>
              ) : (
                <span style={{ color: "red" }}>비밀번호를 확인해 주세요.</span>
              )
            ) : null}
            <ContainedButton
              style={{ padding: "1rem 0rem", fontSize: "2.5vmin" }}
              variant="outlined"
              type="submit"
            >
              Sign Up
            </ContainedButton>
          </Box>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "65vmin",
              fontSize: "1rem",
              marginTop: "1rem",
            }}
          >
            <span style={{ marginRight: "10px" }}>계정이 있으신가요?</span>
            <Link href="/login" passHref>
              <a
                style={{
                  color: "#5254F3",
                  borderRadius: "0%",
                  borderBottom: "0.5px solid",
                }}
              >
                Login
              </a>
            </Link>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
export default Signup;
