import React from "react";
const Layout = ({ children, classes }) => {
  return (
    <div className={`${classes} flex flex-col`}>
      {children}
    </div>
  );
};

export default Layout;
