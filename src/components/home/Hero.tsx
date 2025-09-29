"use client";

import { useState } from "react";

export default function Hero() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect this to AI search API
    console.log("Searching for scheme:", query);
  };

  return (
    <section className="relative flex flex-col items-center justify-center h-[70vh] bg-white dark:bg-gray-900">
      <div className="text-center px-6 lg:px-12 max-w-3xl">
        {/* Headline */}
        <h1 className="text-4xl lg:text-5xl font-bold text-blue-950 dark:text-white mb-6">
          Discover Government Schemes Effortlessly
        </h1>

        {/* Subtext */}
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Access every government scheme in one place. Find your eligibility, 
          benefits, and how to apply – all with ease.
        </p>

        {/* Search Box */}
        {/* <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <input
            type="text"
            placeholder="Search schemes by name, eligibility, or benefit..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:w-96 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-900 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="px-6 py-3 text-white bg-blue-900 rounded-xl font-medium hover:bg-blue-800 transition"
          >
            Search
          </button>
        </form> */}

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <a
            href="/schemes"
            className="px-6 py-3 text-white bg-blue-900 rounded-xl font-medium hover:bg-blue-800 transition"
          >
            Explore Schemes
          </a>
          <a
            href="/sign-in"
            className="px-6 py-3 text-blue-900 bg-white rounded-xl font-medium border border-blue-900 hover:bg-gray-100 transition"
          >
            Login
          </a>
        </div>
      </div>
    </section>
  );
}
