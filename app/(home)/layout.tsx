import React from "react";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full bg-black">{children}</div>;
};

export default HomeLayout;
