import React from "react";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

function Layout({ children }) {
  console.log(children.type.prototype.constructor.name);
  if (children.type.prototype.constructor.name === "Login") {
    return <div>{children}</div>;
  } else if (children.type.prototype.constructor.name === "Signup") {
    return <div>{children}</div>;
  } else if (children.type.prototype.constructor.name === "Index") {
    return (
      <div>
        <Navbar />
        {children}
      </div>
    );
  } else if (children.type.prototype.constructor.name === "Profile") {
    return (
      <div>
        <Sidebar />
        {children}
      </div>
    );
  } else if (children.type.prototype.constructor.name === "Explore") {
    return <div>{children}</div>;
  } else if (children.type.prototype.constructor.name === "UserLink") {
    return <div>{children}</div>;
  } else if (children.type.prototype.constructor.name === "Settings") {
    return (
      <div>
        <Sidebar />
        {children}
      </div>
    );
  } else if (children.type.prototype.constructor.name === "Onboarding") {
    return <div>{children}</div>;
  } else if (children.type.prototype.constructor.name === "Practice") {
    return <div>{children}</div>;
  } else if (children.type.prototype.constructor.name === "Loading") {
    return <div>{children}</div>;
  } else if (children.type.prototype.constructor.name === "Messages") {
    return (
      <div>
        <Sidebar />
        {children}
      </div>
    );
  } else if (children.type.prototype.constructor.name === "NotionPage") {
    return <div>{children}</div>;
  } else {
    return null;
  }
  return null;
}
export default Layout;
