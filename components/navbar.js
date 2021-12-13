import Link from "next/link";
import Image from "next/image";
import logobox from "../public/logobox.png";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { TextButton, ContainedButton } from "./styledButton";

export default function Navbar() {
  return (
    <nav
      style={{
        width: "100%",
        height: "60px",
        padding: "5vmin 3vmin",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        backgroundColor: "white",
        zIndex: 2,
      }}
    >
      <div style={{ cursor: "pointer" }}>
        <Link href="/" passHref>
          <Image width="125px" height="45px" src={logobox} alt="logobox" />
        </Link>
      </div>
      <div>
        <Stack spacing={1.5} direction="row">
          <TextButton variant="text" href="/explore" color="inherit">
            Explore
          </TextButton>
          <ContainedButton variant="contained" href="/signup">
            Sign Up
          </ContainedButton>
        </Stack>
      </div>
    </nav>
  );
}
