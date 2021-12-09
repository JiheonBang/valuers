import React, { useState } from "react";
import firebase, { authService, dbService } from "../firebase/initFirebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
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

function Login() {
  const router = useRouter();
  // authService.onAuthStateChanged(async (user) => {
  //   if (user) {
  //     const infoSnapshot = await dbService.doc(`userInfo/${user.uid}`).get();
  //     if (infoSnapshot.exists) {
  //       router.push(`/loading`);
  //     }
  //   }
  // });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let user;
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await authService.signInWithEmailAndPassword(email, password).then(() => {
        router.push("/loading");
      });
    } catch (err) {
      alert(err.message);
    }
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
            어서오세요 🙌
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
            <span style={{ fontSize: "1rem", marginLeft: "1rem" }}>
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

            <ContainedButton
              style={{ padding: "1rem 0rem", fontSize: "2.5vmin" }}
              variant="outlined"
              type="submit"
            >
              Login
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
            <span style={{ marginRight: "10px" }}>계정이 없으신가요?</span>
            <Link href="/signup" passHref>
              <a
                style={{
                  color: "#5254F3",
                  borderRadius: "0%",
                  borderBottom: "0.5px solid",
                }}
              >
                Sign Up
              </a>
            </Link>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
export default Login;
