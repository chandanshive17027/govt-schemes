"use client";

import React, { useEffect, useState } from "react";

interface Scheme {
  id: string;
  name: string;
  link?: string;
  tags?: string[];
}

interface CategorizedSchemes {
  education: Scheme[];
  agriculture: Scheme[];
  health: Scheme[];
  women: Scheme[];
  seniorCitizen: Scheme[];
  employment: Scheme[];
}

const categories = [
  "education",
  "agriculture",
  "health",
  "women",
  "seniorCitizen",
  "employment"
];

export default function CategorizedSchemesComponent() {
  const [data, setData] = useState<CategorizedSchemes | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("education");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/schemes/categorized");
        if (!res.ok) throw new Error("Failed to fetch schemes");
        const json = await res.json();
        setData(json.categorized);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  if (loading) return <p>Loading schemes...</p>;
  if (error) return <p className="text-red-600">⚠️ {error}</p>;
  if (!data) return <p>No schemes found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Schemes by Category</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)} (
            {data[cat as keyof CategorizedSchemes]?.length || 0})
          </button>
        ))}
      </div>

      {/* Schemes List */}
      <div className="space-y-2">
        {data[activeCategory as keyof CategorizedSchemes]?.length > 0 ? (
          data[activeCategory as keyof CategorizedSchemes].map((scheme) => (
            <div
              key={scheme.id}
              className="p-2 rounded bg-blue-100 flex justify-between items-center"
            >
              <span>{scheme.name}</span>
              {scheme.link && (
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              )}
            </div>
          ))
        ) : (
          <p>No schemes found in this category.</p>
        )}
      </div>
    </div>
  );
}
