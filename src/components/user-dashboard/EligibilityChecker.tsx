"use client";

import React, { useState } from "react";

interface Scheme {
  id: string;
  name: string;
  link?: string;
}

export default function EligibilityChecker({ userId }: { userId: string }) {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!userId) {
      setError("User not logged in");
      return;
    }

    setLoading(true);
    setError(null);
    setSchemes([]);

    try {
      // Run backend eligibility check
      const resCheck = await fetch("/api/check-eligiblity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!resCheck.ok) throw new Error("Failed to run eligibility check");

      // Fetch user data to get eligibleSchemes
      const resUser = await fetch(`/api/user/${userId}`);
      if (!resUser.ok) throw new Error("Failed to fetch user data");

      const user = await resUser.json();
      if (!user.eligibleSchemes || user.eligibleSchemes.length === 0) {
        setSchemes([]);
        return;
      }

      // Fetch scheme details
      const resSchemes = await fetch("/api/schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: user.eligibleSchemes }),
      });

      if (!resSchemes.ok) throw new Error("Failed to fetch schemes");

      const schemeData: Scheme[] = await resSchemes.json();
      setSchemes(schemeData);
    } catch (error) {
      console.error("Error checking eligibility:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Eligible Schemes</h1>
      <button
        onClick={handleCheck}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 mb-4"
        disabled={loading}
      >
        {loading ? "Checking..." : "Check My Eligible Schemes"}
      </button>

      {error && <p className="text-red-600 mb-4">⚠️ {error}</p>}

      {schemes.length > 0 ? (
        <ul className="space-y-2">
          {schemes.map((s) => (
            <li key={s.id} className="p-2 rounded bg-blue-100">
              <strong>{s.name}</strong>{" "}
              {s.link && (
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline ml-2"
                >
                  View
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No eligible schemes found.</p>
      )}
    </div>
  );
}
