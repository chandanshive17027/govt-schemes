"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOut } from "../auth/SignOut";

export default function Navbar({username}: {username?: string | null}) {
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
            <Link href="/dashboard">Govt-Schemes</Link>
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

            {/* User profile */}

            <DropdownMenu>
              {/* Go to profile trigger */}
              <DropdownMenuTrigger className="w-8 h-8 text-sm font-medium rounded-full text-white bg-blue-900 hover:bg-blue-800 dark:bg-white dark:text-blue-900 dark:hover:bg-gray-200 transition">
                {username} 
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg w-48">
                <DropdownMenuLabel className="text-gray-500 dark:text-gray-400">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/user-profile"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Go to Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/profile"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Update Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/bookmarks"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Saved Schemes
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/settings"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/sign-in"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <SignOut/>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
