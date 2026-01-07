"use client";

import * as React from "react";

type ThemeColor = "coffee" | "blue" | "green" | "purple";

type ThemeColorProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeColor;
  storageKey?: string;
};

type ThemeColorProviderState = {
  themeColor: ThemeColor;
  setThemeColor: (theme: ThemeColor) => void;
};

const initialState: ThemeColorProviderState = {
  themeColor: "coffee",
  setThemeColor: () => null,
};

const ThemeColorProviderContext =
  React.createContext<ThemeColorProviderState>(initialState);

export function ThemeColorProvider({
  children,
  defaultTheme = "coffee",
  storageKey = "ui-theme-color",
  ...props
}: ThemeColorProviderProps) {
  const [themeColor, setThemeColor] = React.useState<ThemeColor>(defaultTheme);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as ThemeColor | null;
    if (savedTheme) {
      setThemeColor(savedTheme);
    }
    setIsMounted(true);
  }, [storageKey]);

  React.useEffect(() => {
    if (!isMounted) return;
    const root = window.document.body; // Applying to body

    // Remove old attributes if we were using classes, but we use data attribute
    root.setAttribute("data-theme-color", themeColor);

    localStorage.setItem(storageKey, themeColor);
  }, [themeColor, storageKey, isMounted]);

  const value = {
    themeColor,
    setThemeColor,
  };

  return (
    <ThemeColorProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeColorProviderContext.Provider>
  );
}

export const useThemeColor = () => {
  const context = React.useContext(ThemeColorProviderContext);

  if (context === undefined)
    throw new Error("useThemeColor must be used within a ThemeColorProvider");

  return context;
};
