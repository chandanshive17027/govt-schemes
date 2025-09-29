"use client";

import React, { useEffect, useState } from "react";

interface Scheme {
  id: string;
  name: string; // scheme title
  link?: string;
}

interface User {
  id: string;
  name?: string;
  eligibleSchemes: string[];
}

const EligibleSchemesPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);


  // Fetch current user data
  const fetchUserData = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data: User = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  // Fetch schemes by IDs
  const fetchSchemes = async (schemeIds: string[]) => {
    try {
      if (!schemeIds.length) {
        setSchemes([]);
        return;
      }

      const res = await fetch("/api/scheme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: schemeIds }),
      });

      const data: Scheme[] = await res.json();
      setSchemes(data);
    } catch (err) {
      console.error("Error fetching schemes:", err);
    }
  };

  // Trigger backend to update eligibleSchemes
  const updateEligibility = async () => {
    if (!user) return;
    setUpdating(true);

    try {
      await fetch("/api/check-eligibility", { method: "POST" });
      await fetchUserData(); // refresh user after update
    } catch (err) {
      console.error("Error updating eligibility:", err);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUserData();
    };
    init();
  }, []);

  useEffect(() => {
    if (user?.eligibleSchemes?.length) {
      fetchSchemes(user.eligibleSchemes);
    } else {
      setSchemes([]);
    }
    setLoading(false);
  }, [user]);

  if (loading) return <p>Loading eligible schemes...</p>;

  if (!user) return <p>User not found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Eligible Schemes for {user.name || "You"}
      </h1>

      <button
        onClick={updateEligibility}
        disabled={updating}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {updating ? "Updating..." : "Check Eligibility"}
      </button>

      {schemes.length === 0 ? (
        <p>No eligible schemes found.</p>
      ) : (
        <ul className="space-y-2">
          {schemes.map((scheme) => (
            <li key={scheme.id} className="border p-2 rounded shadow-sm">
              <a
                href={scheme.link || `/schemes/${scheme.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {scheme.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EligibleSchemesPage;
