// components/home/Newsletter.tsx
"use client";
import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Here you can integrate with backend or email service
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold text-blue-900 mb-4">
          Stay Updated with Latest Schemes
        </h2>
        <p className="text-blue-800 mb-8">
          Subscribe to our newsletter and never miss out on any important scheme.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 w-full sm:w-auto sm:flex-1 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition"
          >
            Subscribe
          </button>
        </form>

        {submitted && (
          <p className="mt-4 text-green-600 font-medium">
            Thank you for subscribing!
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
