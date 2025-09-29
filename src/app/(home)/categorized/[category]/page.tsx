import React from "react";
import Link from "next/link";

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

  if (!categoryNames[category]) return <p>Category not found</p>;

  try {
    // Fetch only schemes for this category
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categorized/${category}`);
    if (!res.ok) throw new Error("Failed to fetch schemes");

    const json = await res.json();
    const schemes: Scheme[] = json.schemes || [];

    return (
      <div className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">
          {categoryNames[category]} Schemes
        </h1>

        {schemes.length > 0 ? (
          <ul className="space-y-4">
            {schemes.map((scheme) => (
              <li
                key={scheme.id}
                className="p-4 bg-blue-50 rounded flex justify-between items-center"
              >
                <span>{scheme.name}</span>
                {scheme.link && (
                  <a
                    href={`/schemes/${scheme.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No schemes found in this category.</p>
        )}

        <div className="mt-8">
          <Link href="/" className="text-blue-600 underline">
            ← Back to categories
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    return <p className="text-red-600">⚠️ {(error as Error).message}</p>;
  }
};

export default CategoryPage;
