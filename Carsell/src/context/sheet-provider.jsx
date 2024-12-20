"use client";
import React, { createContext, useContext, useState } from "react";

const SheetContext = createContext();

export const SheetProvider = ({ children }) => {
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <SheetContext.Provider value={{ openSheet, setOpenSheet }}>
      {children}
    </SheetContext.Provider>
  );
};

export const useSheet = () => useContext(SheetContext);
