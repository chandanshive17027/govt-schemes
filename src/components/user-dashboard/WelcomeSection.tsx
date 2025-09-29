// src/components/user-dashboard/WelcomeSection.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // shadcn/ui button

interface WelcomeSectionProps {
  userName: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  const router = useRouter();

  return (
    <section className="w-full py-12 px-6 md:px-12 mt-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-xl md:text-4xl font-bold text-blue-900 mb-4">
          Welcome, {userName}!
        </h1>
        <p className="text-blue-800 text-lg md:text-xl mb-6">
          Explore government schemes tailored for you. Stay informed and take advantage of them.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button
            onClick={() => router.push("/dashboard/profile")}
            className="rounded-md px-6 py-2 text-white bg-blue-900 hover:bg-blue-700 shadow-md"
          >
            Update Your Profile
          </Button>

          <Button
            onClick={() => router.push("/dashboard/schemes")}
            className="rounded-md px-6 py-2 text-blue-900 bg-white border border-blue-900 hover:bg-blue-50 shadow-md"
          >
            View All Schemes
          </Button>
        </div>
      </div>
    </section>
  );
}
