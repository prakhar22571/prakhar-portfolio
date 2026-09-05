import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { ThemeContext } from "../lib/theme-context.js";
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "portfolio-theme",
}) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return ["light", "dark", "system"].includes(saved) ? saved : defaultTheme;
  });
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved =
        theme === "system" ? (media.matches ? "dark" : "light") : theme;
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(resolved);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  const value = {
    theme,
    setTheme: (next) => {
      localStorage.setItem(storageKey, next);
      setTheme(next);
    },
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
  defaultTheme: PropTypes.string,
  storageKey: PropTypes.string,
};
