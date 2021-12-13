import React, { useState } from "react";
import { authService, dbService } from "../firebase/initFirebase";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import logobox from "../public/logobox.png";

import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";

const drawerWidth = 240;

function Sidebar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [userLink, setUserLink] = useState();
  authService.onAuthStateChanged(async (user) => {
    if (user) {
      if (dbService.doc(`userInfo/${user.uid}`)) {
        const userInfo = await dbService.doc(`userInfo/${user.uid}`).get();
        const givenLink = userInfo.data().userLink;
        setUserLink(givenLink);
      } else {
        setUserLink(null);
      }
    } else {
      setUserLink(null);
    }
  });

  const SidebarData = [
    {
      title: "Profile",
      path: `/${userLink}`,
      icon: <AccountCircleIcon />,
    },
    {
      title: "Explore",
      path: "/explore",
      icon: <RocketLaunchIcon />,
    },
    {
      title: "Messages",
      path: "/messages",
      icon: <MailIcon />,
    },
  ];
  const router = useRouter();
  const Logout = () => {
    authService.signOut().then(() => router.push("/"));
  };

  let a;
  if (router.asPath.split("/")[1] === `${userLink}`) {
    a = "Profile";
  } else if (router.asPath === "/settings") {
    a = "Settings";
  } else if (router.asPath === "/messages") {
    a = "Messages";
  } else {
    a = "Explore";
  }

  const drawer = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Toolbar style={{ margin: "0rem 0rem 2rem -0.5rem" }}>
        <Image width="125px" height="45px" src={logobox} alt="logobox" />
      </Toolbar>
      <List>
        {SidebarData.map((item) => (
          <Link href={item.path} key={item.title} passHref>
            <ListItem
              button
              key={item.title}
              style={
                a === item.title
                  ? {
                      color: "#5E54F3",
                      backgroundColor: "#E7E5FF",
                      borderLeft: "3px solid #5E54F3",
                    }
                  : null
              }
            >
              <ListItemIcon
                style={
                  a === item.title
                    ? {
                        color: "#5E54F3",
                      }
                    : null
                }
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          </Link>
        ))}
        <List style={{ marginTop: "40vh" }}>
          <Divider style={{ marginBottom: "1rem" }} />
          <a
            href="https://ossified-language-542.notion.site/Valuers-46e2fe1f4c4d4626b46d79b6125c7fe0"
            target="_blank"
            ref="noreferrer"
          >
            <ListItem button>
              <ListItemIcon>
                <HelpOutlineIcon />
              </ListItemIcon>
              <ListItemText>Help</ListItemText>
            </ListItem>
          </a>
          <Link href="/settings" passHref>
            <ListItem
              button
              style={
                router.pathname === "/settings"
                  ? {
                      color: "#5E54F3",
                      backgroundColor: "#E7E5FF",
                      borderLeft: "3px solid #5E54F3",
                    }
                  : null
              }
            >
              <ListItemIcon
                style={
                  router.pathname === "/settings"
                    ? {
                        color: "#5E54F3",
                      }
                    : null
                }
              >
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText>Settings</ListItemText>
            </ListItem>
          </Link>
          <ListItem button onClick={Logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItem>
        </List>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        color="success"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ ml: 2, mt: 2, display: { md: "none" } }}
      >
        <MenuIcon />
      </Box>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

Sidebar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Sidebar;
