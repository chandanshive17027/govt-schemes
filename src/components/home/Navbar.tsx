"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {

  const [darkMode, setDarkMode] = useState(false);



  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Website Name */}
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-50">
            <Link href="/">MySchemes</Link>
          </div>

          {/* Right Side: Theme toggle + Login */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-blue-900" />
              )}
            </button>

            {/* Login */}
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium rounded-xl text-white bg-blue-900 hover:bg-blue-800 dark:bg-white dark:text-blue-900 dark:hover:bg-gray-200 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
