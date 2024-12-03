"use client";

import * as React from "react";
import { MoonIcon, SunIcon, LaptopIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [activeTheme, setActiveTheme] = React.useState("light");

  React.useEffect(() => {
    if (theme) {
      setActiveTheme(theme);
    }
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setActiveTheme(newTheme);
  };

  return (
    <div className="flex w-2/4 items-center justify-center border rounded-full gap-x-1 h-6">
      {" "}
      {/* Altura ajustada */}
      <Button
        variant="outline"
        onClick={(e) => {
          handleThemeChange("light");
          e.stopPropagation();
        }}
        className={`flex-1 h-full p-1 flex items-center justify-center rounded-full shadow-none hover:bg-transparent ${
          activeTheme === "light" ? "" : "bg-transparent border-transparent"
        }`}
      >
        <SunIcon className="h-3 w-3" /> {/* Tamaño de ícono reducido */}
      </Button>
      <Button
        variant="outline"
        onClick={(e) => {
          handleThemeChange("system");
          e.stopPropagation();
        }}
        className={`flex-1 h-full p-1 flex items-center justify-center rounded-full shadow-none hover:bg-transparent ${
          activeTheme === "system" ? "" : "bg-transparent border-transparent"
        }`}
      >
        <LaptopIcon className="h-3 w-3" /> {/* Tamaño de ícono reducido */}
      </Button>
      <Button
        variant="outline"
        onClick={(e) => {
          handleThemeChange("dark");
          e.stopPropagation();
        }}
        className={`flex-1 h-full p-1 flex items-center justify-center rounded-full shadow-none hover:bg-transparent ${
          activeTheme === "dark" ? "" : "bg-transparent border-transparent"
        }`}
      >
        <MoonIcon className="h-3 w-3" /> {/* Tamaño de ícono reducido */}
      </Button>
    </div>
  );
}
