// src/app/category/[category]/page.tsx
import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Scheme {
  id: string;
  name: string;
  link?: string;
}

interface CategoryPageProps {
  params: { category: string };
}

// Map category keys to display names
const categoryNames: Record<string, string> = {
  education: "Education",
  agriculture: "Agriculture",
  health: "Health",
  women: "Women",
  seniorCitizen: "Senior Citizens",
  employment: "Employment",
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { category } = params;

  // Invalid category check
  if (!categoryNames[category]) {
    return (
      <p className="text-center text-red-600 mt-10">⚠️ Category not found</p>
    );
  }

  try {
    // Fetch schemes for this category
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/categorized/${category}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch schemes");
    }

    const data = await res.json();
    const schemes: Scheme[] = data.schemes || [];

    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${category}`}>
                {categoryNames[category]}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          {categoryNames[category]} Schemes
        </h1>

        {/* Schemes List */}
        {schemes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
            {schemes.map((scheme) => (
              <Card
                key={scheme.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg font-semibold">
                    {scheme.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-end">
                  {scheme.link ? (
                    <Button asChild size="sm" className="rounded-xl">
                      <Link href={`/schemes/${scheme.id}`} target="_blank">
                        View
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" disabled>
                      Not Available
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg bg-gray-50">
            <p className="text-lg font-medium text-gray-700">
              No schemes found in this category.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              ← Back to categories
            </Link>
          </div>
        )}
      </div>
    );
  } catch (error) {
    return (
      <p className="text-red-600 font-medium text-center mt-10">
        ⚠️ {(error as Error).message}
      </p>
    );
  }
};

export default CategoryPage;
