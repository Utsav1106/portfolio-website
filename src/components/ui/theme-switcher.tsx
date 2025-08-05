"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { cn } from "@/utils/helpers";

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const persisted = localStorage.getItem("portfolio-theme");
    const initial = persisted === "dark" || persisted === "light" ? persisted : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("portfolio-theme", newTheme);
    const html = document.documentElement;
    html.style.display = "none";
    html.style.display = "";
  };

  return (
    <motion.button
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.0, ease: "easeOut" }}
      onClick={toggleTheme}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full",
        "bg-gray-950/40 backdrop-blur-xl border border-white/10",
        "dark:bg-gray-950/40 dark:border-white/10",
        "light:bg-white/50 cursor-pointer light:border-gray-200",
        "transition-colors duration-200 hover:bg-white/20 dark:hover:bg-white/20 light:hover:bg-gray-400/20"
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <MdLightMode className="h-6 w-6 text-yellow-400" /> : <MdDarkMode className="h-6 w-6 text-gray-700" />}
    </motion.button>
  );
};