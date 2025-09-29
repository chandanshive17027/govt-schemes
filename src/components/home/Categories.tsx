"use client";

import React from "react";
import { useRouter } from "next/navigation";

const categoriesList = [
  { key: "education", name: "Education", icon: "🎓" },
  { key: "agriculture", name: "Agriculture", icon: "🌾" },
  { key: "health", name: "Health", icon: "🩺" },
  { key: "women", name: "Women", icon: "👩" },
  { key: "seniorCitizen", name: "Senior Citizens", icon: "👵" },
  { key: "employment", name: "Employment", icon: "💼" },
];

const Categories = () => {
  const router = useRouter();

  const handleCategoryClick = (categoryKey: string) => {
    // Navigate to category page
    router.push(`/categorized/${categoryKey}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold text-blue-900 mb-8">
          Explore Schemes by Category
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categoriesList.map((cat) => (
            <div
              key={cat.key}
              onClick={() => handleCategoryClick(cat.key)}
              className="flex flex-col items-center justify-center p-6 rounded-xl shadow transition duration-300 cursor-pointer bg-gradient-to-b from-blue-50 to-white hover:shadow-lg"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <span className="text-blue-900 font-medium">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
