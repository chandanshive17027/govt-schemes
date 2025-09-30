"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

interface Scheme {
  id: string;
  name: string;
  ministry?: string;
  state?: string;
  link?: string;
  details?: string;
}

const EligibilityChecker = ({ userId }: { userId: string }) => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [prevSchemeIds, setPrevSchemeIds] = useState<string[]>([]); // track previous schemes

  const fetchEligibleSchemes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/check-eligiblity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok) {
        const newSchemes: Scheme[] = data.eligibleSchemes || [];
        const newSchemeIds = newSchemes.map((s) => s.id);
        const hasNewScheme = newSchemeIds.some(
          (id) => !prevSchemeIds.includes(id)
        );

        setSchemes(newSchemes);
        setPrevSchemeIds(newSchemeIds);

        setEmailSent(hasNewScheme && newSchemes.length > 0);
      } else {
        console.error(data.error || "Failed to fetch eligible schemes");
      }
    } catch (err: unknown) {
      // Safely check if `err` is an instance of `Error`
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("❌ An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [userId, prevSchemeIds]); // 👈 include deps

  const handleBookmark = (schemeId: string) => {
    if (!bookmarks.includes(schemeId)) {
      setBookmarks([...bookmarks, schemeId]);
      toast.success("Scheme bookmarked!");
    }
  };

  useEffect(() => {
    fetchEligibleSchemes();
  }, [fetchEligibleSchemes]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Top Recommended Schemes</h2>

      {emailSent && (
        <p className="text-green-600 mb-4">
          ✅ New recommendations have been sent to your email.
        </p>
      )}

      {loading ? (
        <p>Loading recommendations...</p>
      ) : schemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schemes.map((scheme) => (
            <Card
              key={scheme.id}
              className="border hover:shadow-lg transition rounded-2xl"
            >
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">
                  {scheme.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleBookmark(scheme.id)}
                  title="Bookmark Scheme"
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                {scheme.details && <p>{scheme.details}</p>}
                <p>
                  <strong>Ministry:</strong> {scheme.ministry || "N/A"}
                </p>
                <p>
                  <strong>State:</strong> {scheme.state || "All States"}
                </p>
                {scheme.link && (
                  <p>
                    <a
                      href={`/schemes/${scheme.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Details
                    </a>
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No schemes found for your profile.</p>
      )}
    </div>
  );
};

export default EligibilityChecker;
