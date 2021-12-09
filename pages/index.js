import React, { useState, useEffect } from "react";
import { authService, dbService } from "../firebase/initFirebase";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import index1 from "../public/index1.svg";
import valuers1 from "../public/valuers1.png";
import valuers2 from "../public/valuers2.png";
import valuers3 from "../public/valuers3.png";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { ContainedButton, OutlinedButton } from "../components/styledButton";

function Index() {
  console.log("initializing...");
  const router = useRouter();
  authService.onAuthStateChanged(async (user) => {
    if (user) {
      const infoSnapshot = await dbService.doc(`userInfo/${user.uid}`).get();
      if (infoSnapshot.exists) {
        router.push(`/loading`);
      }
    }
  });
  console.log("get user Info...");
  return (
    <>
      {console.log("starting")}
      <div style={{ margin: 0, padding: 0 }}>
        <Grid
          container
          sx={{
            paddingTop: "120px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={10} md={4} sx={{ marginLeft: { md: "5rem" } }}>
            <h1>내 가치를 세상에 알려요.</h1>
            <h3>지금, 포트폴리오를 업데이트 하고</h3>
            <h3 style={{ marginTop: "-0.5rem" }}>
              더 많은 사람들과 가치를 공유하세요.
            </h3>
            <Link href="/signup" passHref>
              <ContainedButton
                type="contained"
                sx={{
                  height: "8vmin",
                  width: "25vmin",
                  fontSize: "3vmin",
                  marginTop: "1rem",
                  marginBottom: { xs: "0", md: "3rem" },
                }}
              >
                Get Started
              </ContainedButton>
            </Link>
          </Grid>
          <Grid item xs={10} md={5.3} sx={{ marginLeft: { md: "-5rem" } }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                heigth: "100%",
                marginTop: "-4rem",
              }}
            >
              <Image src={index1} alt="index1" />
            </div>
          </Grid>
        </Grid>
      </div>
      <div style={{ margin: 0, padding: 0, backgroundColor: "#f4f4f4" }}>
        <Grid
          container
          sx={{
            paddingTop: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={10} md={6}>
            <h2 style={{ color: "#5254F3" }}>Multi Persona</h2>
            <h2>다양한 페르소나 설정</h2>
            <h3>내가 가진 다양한 모습을 포트폴리오에 녹여내요.</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                heigth: "100%",
              }}
            >
              <Image src={valuers1} alt="valuers1" />
            </div>
          </Grid>
        </Grid>
      </div>
      <div style={{ margin: 0, padding: 0, backgroundColor: "#f4f4f4" }}>
        <Grid
          container
          sx={{
            paddingTop: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={10} md={6} sx={{ mt: "1rem" }}>
            <h2 style={{ color: "#5254F3" }}>Link with Notion</h2>
            <h2>노션 페이지 연동</h2>
            <h3>노션 링크 연결로 편하게 포트폴리오를 만들 수 있어요.</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                heigth: "100%",
              }}
            >
              <Image src={valuers2} alt="valuers2" />
            </div>
          </Grid>
        </Grid>
      </div>
      <div style={{ margin: 0, padding: 0, backgroundColor: "#f4f4f4" }}>
        <Grid
          container
          sx={{
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={10} md={6} sx={{ mt: "1rem" }}>
            <h2 style={{ color: "#5254F3" }}>New Relationship</h2>
            <h2>새로운 연결</h2>
            <h3>내 포트폴리오를 기반으로 새로운 기회를 찾을 수 있어요.</h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                heigth: "100%",
              }}
            >
              <Image src={valuers3} alt="valuers3" />
            </div>
          </Grid>
        </Grid>
      </div>
      <div style={{ margin: 0, padding: 0 }}>
        <Grid
          container
          sx={{
            padding: "30px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={10} md={6} sx={{ textAlign: "center" }}>
            <h1>새로운 기회를 만들어 보세요!</h1>
            <h3>지금, 포트폴리오를 만들고</h3>
            <h3 style={{ marginTop: "-0.5rem" }}>
              더 많은 사람들과 가치를 공유하세요.
            </h3>
            <Link href="/signup" passHref>
              <ContainedButton
                type="contained"
                sx={{
                  height: "8vmin",
                  width: "25vmin",
                  fontSize: "3vmin",
                  marginTop: "1rem",
                  marginBottom: "3rem",
                }}
              >
                Get Started
              </ContainedButton>
            </Link>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Index;
