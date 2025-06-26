import React from "react";

const ThemeSelector = () => {
    
  function handleThemeChange(e) {
    const theme = e.target.value;
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }

  return (
    <div className="sidebar__item-value w-full flex justify-end items-center gap-2 text-xs font-light text-neutral-900 dark:text-neutral-100 ">
      <select
        name="color-scheme"
        id="color-scheme"
        className="outline-none md:outline-2"
        onChange={handleThemeChange}
        defaultValue={localStorage.getItem("theme") || "system"}
      >
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
};

export default ThemeSelector;
