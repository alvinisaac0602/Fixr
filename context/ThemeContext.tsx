import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: any) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const theme = {
    darkMode,
    colors: darkMode
      ? {
          background: "#121212",
          card: "#1E1E1E",
          text: "#FFFFFF",
          subtitle: "#A1A1A1",
          border: "#2A2A2A",
        }
      : {
          background: "#F7F7F7",
          card: "#FFFFFF",
          text: "#111111",
          subtitle: "#666666",
          border: "#E5E5E5",
        },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);