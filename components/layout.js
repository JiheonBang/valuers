import React from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

function Layout({ children }) {
  console.log(children.type.name);
  if (children.type.name === "Login") {
    return <div>{children}</div>;
  } else if (children.type.name === "Signup") {
    return <div>{children}</div>;
  } else if (children.type.name === "Index") {
    return (
      <div>
        <Navbar />
        {children}
      </div>
    );
  } else if (children.type.name === "Profile") {
    return (
      <div>
        <Sidebar />
        {children}
      </div>
    );
  } else if (children.type.name === "Explore") {
    return <div>{children}</div>;
  } else if (children.type.name === "UserLink") {
    return <div>{children}</div>;
  } else if (children.type.name === "Settings") {
    return (
      <div>
        <Sidebar />
        {children}
      </div>
    );
  } else if (children.type.name === "Onboarding") {
    return <div>{children}</div>;
  } else if (children.type.name === "Practice") {
    return <div>{children}</div>;
  } else if (children.type.name === "Loading") {
    return <div>{children}</div>;
  } else if (children.type.name === "Messages") {
    return (
      <div>
        <Sidebar />
        {children}
      </div>
    );
  } else if (children.type.name === "NotionPage") {
    return <div>{children}</div>;
  } else {
    return null;
  }
}
export default Layout;
