"use client";

import { Scheme } from "@/utils/types/types";
import { useEffect, useState } from "react";
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [bookmarks, setBookmarks] = useState<string[]>([]); // store bookmarked schemeIds

  

  // Fetch all schemes
  const getSchemes = async () => {
    try {
      const res = await fetch("/api/schemes");
      if (res.ok) {
        const data = await res.json();
        setSchemes(data);
        setFilteredSchemes(data);
      }
    } catch (error) {
      console.error("Error fetching schemes:", error);
    }
  };

  // Fetch user's bookmarked schemes
  const getBookmarks = async () => {
    try {
      const res = await fetch("/api/user/bookmarks");
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.map((b: any) => b.schemeId));
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  // Toggle bookmark
  const toggleBookmark = async (schemeId: string) => {
    const isBookmarked = bookmarks.includes(schemeId);

    try {
      const res = await fetch(`/api/user/bookmark${isBookmarked ? `/${schemeId}` : ""}`, {
        method: isBookmarked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: isBookmarked ? null : JSON.stringify({ schemeId }),
      });

      if (res.ok) {
        setBookmarks((prev) =>
          isBookmarked ? prev.filter((id) => id !== schemeId) : [...prev, schemeId]
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch schemes and bookmarks on mount
  useEffect(() => {
    Promise.all([getSchemes(), getBookmarks()]).finally(() => setLoading(false));
  }, []);

  // Filter schemes by name or ministry
  useEffect(() => {
    if (!filter) {
      setFilteredSchemes(schemes);
    } else {
      const lowerFilter = filter.toLowerCase();
      setFilteredSchemes(
        schemes.filter(
          (s) =>
            s.name.toLowerCase().includes(lowerFilter) ||
            (s.ministry && s.ministry.toLowerCase().includes(lowerFilter))
        )
      );
    }
  }, [filter, schemes]);

  if (loading)
    return (
      <p className="p-6 text-center text-blue-900 dark:text-blue-100">
        Loading schemes...
      </p>
    );

  if (!schemes.length)
    return (
      <p className="p-6 text-center text-blue-900 dark:text-blue-100">
        No schemes found. Run the scraper first.
      </p>
    );

  return (
    <div className="p-6 mt-16 mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-900 dark:text-blue-50">
        Government Schemes
      </h1>

      {/* Filter Input */}
      <div className="mb-6 flex justify-center items-center gap-4">
        <input
          type="text"
          placeholder="Search by name or ministry..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-1 w-[60vh] border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>
      <p className="text-sm text-center mb-4 text-gray-500 dark:text-gray-400">
        {filteredSchemes.length} schemes found
      </p>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-xl transition relative flex flex-col justify-between"
          >
            {/* Bookmark Icon */}
            <button
              onClick={() => toggleBookmark(scheme.id)}
              className="absolute top-2 right-2 text-red-500 hover:scale-110 transition"
            >
              {bookmarks.includes(scheme.id) ? <IoBookmark size={20} /> : <IoBookmarkOutline size={20} />}
            </button>

            <div>
              <h2 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">
                {scheme.name}
              </h2>
              {scheme.ministry && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  {scheme.ministry}
                </p>
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

            {scheme.link && (
              <a
                href={`/schemes/${scheme.id}`}
                className="mt-2 text-sm font-medium text-white bg-blue-900 dark:bg-blue-700 px-4 py-2 rounded-lg text-center hover:bg-blue-800 dark:hover:bg-blue-600 transition"
              >
                View Details
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
