"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/user-dashboard/Navbar";

interface Bookmark {
  id: string;
  schemeId: string;
  scheme: {
    id: string;
    name: string;
    ministry?: string;
    lastDate?: string;
    tags?: string[];
  };
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/user/bookmark");
      if (!res.ok) throw new Error("Failed to fetch bookmarks");
      const data = await res.json();
      setBookmarks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading bookmarks...</p>;

  if (!bookmarks.length)
    return <p className="p-6 text-center text-gray-500">You have no bookmarked schemes yet.</p>;

  return (
    <div>
        <div className="p-6 mt-16 mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-900 dark:text-blue-50">
        Your Bookmarked Schemes
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {bookmarks.map((bookmark) => {
          const scheme = bookmark.scheme;
          return (
            <div
              key={bookmark.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">
                  {scheme.name}
                </h2>
                {scheme.ministry && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{scheme.ministry}</p>
                )}
                {scheme.lastDate && (
                  <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                    <span className="font-semibold">Deadline:</span>{" "}
                    {new Date(scheme.lastDate).toLocaleDateString()}
                  </p>
                )}

                {scheme.tags && scheme.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {scheme.tags
                      .filter((tag) => tag && tag.trim() !== "")
                      .map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => router.push(`/schemes/${scheme.id}`)}
                  className="flex-1 text-sm font-medium text-white bg-blue-900 dark:bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-800 dark:hover:bg-blue-600 transition"
                >
                  View Details
                </button>

                {/* Remove bookmark */}
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/user/bookmark/${scheme.id}`, { method: "DELETE" });
                      if (res.ok) setBookmarks(bookmarks.filter((b) => b.schemeId !== scheme.id));
                    } catch (err) {
                      console.error("Failed to remove bookmark:", err);
                    }
                  }}
                  className="text-sm font-medium text-red-700 dark:text-red-400 border border-red-700 dark:border-red-400 px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
