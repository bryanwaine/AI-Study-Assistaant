import React, { useEffect, useState } from "react";

const ThemeSelector = () => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (!savedTheme) {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  function handleDarkMode() {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    setTheme("dark");
  }

  function handleLightMode() {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    setTheme("light");
  }
  return (
    <div className="sidebar__item-value w-full flex justify-end items-center gap-2 text-xs font-light text-neutral-900 dark:text-neutral-100 ">
      <select
        name="color-scheme"
        id="color-scheme"
        className="outline-none md:outline-2"
        onChange={(e) => {
          if (e.target.value === "dark") {
            handleDarkMode();
          } else {
            handleLightMode();
          }
        }}
        value={theme}
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
};

export default ThemeSelector;
