// src/app/(home)/schemes/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Scheme } from "@/utils/types/types";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export default function SchemeDetailsPage() {
  const params = useParams();
  const schemeId = params.id;

  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [eligibilityResult, setEligibilityResult] = useState<{
    eligible: boolean;
    reasons: string[];
  } | null>(null);
  const [checking, setChecking] = useState(false);

  // Fetch scheme details
  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const res = await fetch(`/api/schemes/${schemeId}`);
        if (res.ok) {
          const data = await res.json();
          setScheme(data);
        } else {
          console.error("Failed to fetch scheme details");
        }
      } catch (error) {
        console.error("Error fetching scheme:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [schemeId]);

  // Check eligibility handler
  const checkEligibility = async () => {
  if (!schemeId) return;
  setChecking(true);
  try {
    const res = await fetch(`/api/eligibility/${schemeId}`, {
      method: "POST", // ✅ must be POST
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Eligibility result from server:", data); // debug log
      setEligibilityResult(data);
    } else {
      console.error("Failed to check eligibility", await res.text());
    }
  } catch (error) {
    console.error("Error checking eligibility:", error);
  } finally {
    setChecking(false);
  }
};


  if (loading)
    return (
      <p className="p-4 text-center text-gray-500">Loading scheme details...</p>
    );
  if (!scheme)
    return <p className="p-4 text-center text-red-500">Scheme not found.</p>;

  return (
    <div>
      <Navbar />
      <div className="p-6 mt-15 max-w-4xl text-justify mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-blue-900 dark:via-gray-900 dark:to-blue-900 p-6 rounded-xl shadow-md">
          <h1 className="text-3xl font-bold text-blue-900 dark:text-white">
            {scheme.name}
          </h1>
          {scheme.ministry && (
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              {scheme.ministry}
            </p>
          )}
        </div>

        {/* Tags */}
        {scheme.tags && scheme.tags.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2">
            {scheme.tags
              .filter((tag) => tag && tag.trim() !== "")
              .map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold bg-blue-100 text-blue-900 dark:bg-blue-700 dark:text-blue-100 px-3 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
          </div>
        )}

        {/* Scheme Info */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
          {scheme.details && (
            <div>
              <span className="font-semibold text-blue-900 dark:text-blue-300">
                Details:
              </span>
              <p className="mt-1">{scheme.details}</p>
            </div>
          )}

          {scheme.benefit && (
            <div>
              <span className="font-semibold text-blue-900 dark:text-blue-300">
                Benefits:
              </span>
              <ul className="list-disc pl-5 mt-1 text-gray-700 dark:text-gray-200">
                {scheme.benefit
                  .split(".")
                  .map((item) => item.trim())
                  .filter((item) => item.length > 0)
                  .map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
              </ul>
            </div>
          )}

          {scheme.eligibility && (
            <div>
              <span className="font-semibold text-blue-900 dark:text-blue-300">
                Eligibility:
              </span>
              <ul className="list-disc pl-5 mt-1 text-gray-700 dark:text-gray-200">
                {scheme.eligibility
                  .split(".")
                  .map((item) => item.trim())
                  .filter((item) => item.length > 0)
                  .map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
              </ul>
            </div>
          )}

          {scheme.application_process && (
            <div>
              <span className="font-semibold text-blue-900 dark:text-blue-300">
                Application Process:
              </span>
              <ul className="list-disc pl-5 mt-1 text-gray-700 dark:text-gray-200">
                {scheme.application_process
                  .split(".")
                  .map((item) => item.trim())
                  .filter((item) => item.length > 0)
                  .map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
              </ul>
            </div>
          )}

          {scheme.documents_required && (
            <div>
              <span className="font-semibold text-blue-900 dark:text-blue-300">
                Documents Required:
              </span>
              <ul className="list-disc pl-5 mt-1 text-gray-700 dark:text-gray-200">
                {scheme.documents_required
                  .split(".")
                  .map((item) => item.trim())
                  .filter((item) => item.length > 0)
                  .map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
              </ul>
            </div>
          )}

          {/* ✅ Eligibility Check Button */}
          <div className="mt-6">
            <button
              onClick={checkEligibility}
              disabled={checking}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
            >
              {checking ? "Checking..." : "Check Eligibility"}
            </button>

            {eligibilityResult && (
              <div className="mt-4 text-sm">
                {eligibilityResult.eligible ? (
                  <p className="text-green-600">
                    ✅ You are eligible for this scheme
                  </p>
                ) : (
                  <div className="text-red-600">
                    <p className="font-medium">❌ You are not eligible:</p>
                    <ul className="list-disc pl-5 mt-1">
                      {eligibilityResult.reasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sources */}
        {scheme.sources_and_resources &&
          scheme.sources_and_resources.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300">
                Sources & References
              </h2>
              <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200 space-y-1">
                {scheme.sources_and_resources.map((src, i) => (
                  <li key={i}>{src}</li>
                ))}
              </ul>
            </div>
          )}
      </div>
      <Footer />
    </div>
  );
}
