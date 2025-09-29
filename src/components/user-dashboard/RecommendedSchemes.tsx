"use client";

import { useEffect, useState } from "react";
import { Scheme } from "@/utils/types/types";
import Link from "next/link";

export default function AIRecommendedSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await fetch("/api/schemes/recommended");
        if (!res.ok) throw new Error("Failed to fetch recommended schemes");
        const data = await res.json();
        // Use fallback to empty array if undefined
        setSchemes(data.schemes || []);
      } catch (err) {
        console.error(err);
        setSchemes([]); // ensure state is array on error
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (loading)
    return <p className="text-center py-6">Loading AI Recommendations...</p>;
  if (!schemes || schemes.length === 0)
    return <p className="text-center py-6">No recommendations found.</p>;

  return (
    <div className="p-6 mt-10 mx-auto max-w-7xl">
      <h2 className="text-3xl font-bold mb-6 text-blue-900 dark:text-blue-50">
        AI Recommended Schemes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {schemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-xl transition flex flex-col justify-between"
          >
            <div>
              <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">
                {scheme.name}
              </h3>
              {scheme.ministry && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {scheme.ministry}
                </p>
              )}
            </div>
            <Link
              href={`/schemes/${scheme.id}`}
              className="mt-2 text-sm font-medium text-white bg-blue-900 dark:bg-blue-700 px-4 py-2 rounded-lg text-center hover:bg-blue-800 dark:hover:bg-blue-600 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
