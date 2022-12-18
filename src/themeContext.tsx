import { createContext, useState } from "react";

interface IThemeContextProps {
  children: React.ReactNode,
};

export const ThemeContext = createContext({
    theme: "dark",
    changeTheme: () => {},
});

export const ThemeContextProvider: React.FC<IThemeContextProps> = (
  props: IThemeContextProps
): JSX.Element => {
  const userTheme = "";
  const localStorageTheme = localStorage.getItem("theme");

  const browserTheme = window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const selectedTheme = userTheme ||
  localStorageTheme || browserTheme || "dark";

  const [theme, setTheme] = useState(selectedTheme);

  const handleThemeChange = () => {
    const isCurrentDark = theme === "dark";
    setTheme(isCurrentDark ? "light" : "dark");
  };

  const context = {
    theme: theme,
    changeTheme: handleThemeChange,
  };
  localStorage.setItem("theme", context.theme);

  return (
    <ThemeContext.Provider value={context}>
      {props.children}
    </ThemeContext.Provider>
  );
}
