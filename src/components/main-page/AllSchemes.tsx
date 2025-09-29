// src/components/user-dashboard/SchemeCard.tsx
"use client";

import React from "react";

interface SchemeCardProps {
  name: string;
  state?: string;
  ministry?: string;
  details?: string;
  benefits?: string;
}

export default function SchemeCard({ name, state, ministry, details, benefits }: SchemeCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition">
      <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1">{name}</h2>
      {state && <p className="text-sm text-gray-500 dark:text-gray-300">State: {state}</p>}
      {ministry && <p className="text-sm text-gray-500 dark:text-gray-300">Ministry: {ministry}</p>}
      {details && <p className="text-sm text-gray-700 dark:text-gray-200 mt-2">{details.substring(0, 120)}...</p>}
      {benefits && <p className="text-sm text-green-700 dark:text-green-400 mt-1">Benefits: {benefits.substring(0, 100)}...</p>}
    </div>
  );
}
