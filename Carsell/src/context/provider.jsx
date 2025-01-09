"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

function Provider({ children }) {
  return (
    <>
      <ProgressBar color="rgb(225, 193, 110)" options={{ showSpinner: false }} />
      {children}
    </>
  );
}

export default Provider;
