import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { lightColors, darkColors } from "../styles/theme/colors";

// Context Tipi
type ThemeContextType = {
  theme: "light" | "dark";
  colors: typeof lightColors; // Aktif renk paleti
  toggleTheme: () => void;
  setTheme: (mode: "light" | "dark") => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme(); // Telefonun kendi ayarı
  const [theme, setTheme] = useState<"light" | "dark">(
    systemScheme === "dark" ? "dark" : "light"
  );

  // Tema değişince renk setini belirle
  const colors = theme === "dark" ? darkColors : lightColors;

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Kolay kullanım için Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
