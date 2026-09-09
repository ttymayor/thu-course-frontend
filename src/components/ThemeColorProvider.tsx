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

const THEME_COLOR_CHANGE_EVENT = "theme-color-change";

function isThemeColor(value: string | null): value is ThemeColor {
  return (
    value === "coffee" ||
    value === "blue" ||
    value === "green" ||
    value === "purple"
  );
}

function subscribeThemeColor(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_COLOR_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_COLOR_CHANGE_EVENT, onStoreChange);
  };
}

const ThemeColorProviderContext =
  React.createContext<ThemeColorProviderState>(initialState);

export function ThemeColorProvider({
  children,
  defaultTheme = "coffee",
  storageKey = "ui-theme-color",
  ...props
}: ThemeColorProviderProps) {
  const themeColor = React.useSyncExternalStore(
    subscribeThemeColor,
    () => {
      const savedTheme = localStorage.getItem(storageKey);
      return isThemeColor(savedTheme) ? savedTheme : defaultTheme;
    },
    () => defaultTheme,
  );

  const setThemeColor = (theme: ThemeColor) => {
    localStorage.setItem(storageKey, theme);
    window.dispatchEvent(new Event(THEME_COLOR_CHANGE_EVENT));
  };

  React.useEffect(() => {
    const root = window.document.body; // Applying to body

    // Remove old attributes if we were using classes, but we use data attribute
    root.setAttribute("data-theme-color", themeColor);

    localStorage.setItem(storageKey, themeColor);
  }, [themeColor, storageKey]);

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
