"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface Scheme {
  id: string;
  name: string;
  state?: string;
  ministry?: string;
  tags?: string[];
  eligibility?: string;
}

const SchemesData = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch("/api/schemes"); // Make sure you have this API
        const data = await res.json();
        setSchemes(data.slice(0, 4)); // show max 4 schemes
        setTotal(data.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading schemes...</p>;

  return (
    <Card className="p-6">
      {/* Header with flex for title and button */}
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Schemes</CardTitle>
          <CardDescription>
            Total Schemes: <span className="font-semibold">{total}</span>
          </CardDescription>
        </div>

        <Link
          href="/admin/allschemes"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
        >
          See All
        </Link>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {schemes.map((scheme) => (
            <Card
              key={scheme.id}
              className="border hover:shadow-lg transition cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="text-sm">{scheme.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-1">
                {scheme.ministry && <p>Ministry: {scheme.ministry}</p>}
                {scheme.state && <p>State: {scheme.state}</p>}
                {scheme.tags && scheme.tags.length > 0 && (
                  <p>Tags: {scheme.tags.join(", ")}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SchemesData;
