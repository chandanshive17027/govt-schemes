"use client";

import React, { useEffect, useState } from "react";

export default function EligibilityChecker() {
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch("/api/check-eligiblity");
        const data = await res.json();
        if (res.ok) setSchemes(data.eligibleSchemes || []);
      } catch (err) {
        console.error("Error fetching eligible schemes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 animate-pulse">Checking your eligibility...</p>
      </div>
    );
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "No further details available.";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
        🎯 Your Eligible Schemes
      </h2>

      {schemes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition p-5 flex flex-col"
            >
              {/* Scheme Name */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {s.name}
              </h3>

              {/* State or Ministry */}
              <p className="text-sm text-blue-900 font-medium mb-3">
                {s.state ? `🌍 State: ${s.state}` : `🏛️ Ministry: ${s.ministry || "N/A"}`}
              </p>

              {/* Truncated Details */}
              <p className="text-sm text-gray-600 flex-1">
                {truncateText(s.details, 100)}
              </p>

              {/* Action Button */}
              <div className="mt-4">
                <button className="w-full bg-blue-900 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition"
                  onClick={() => window.open(`/schemes/${s.id}`, "_blank")}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          ❌ No eligible schemes found at the moment.
        </p>
      )}
    </div>
  );
}
