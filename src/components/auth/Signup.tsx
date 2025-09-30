// src/components/auth/Signup.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(data.message);
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err: unknown) {
      // Safely check if `err` is an instance of `Error`
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("❌ An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex min-h-svh mx-auto w-full bg-primary-900 items-center justify-center p-10 md:p-15 ">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader className="text-center ">
            <CardTitle className="text-xl">Signup Form</CardTitle>
            <CardDescription>
              Enter you details below to create account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="">
              <div className="grid gap-4 md:mx-8 sm:mx-15 pt-3">
                <div className="grid gap-3">
                  <Label>Full Name</Label>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  variant={"default"}
                  type="submit"
                  disabled={loading}
                  // className="w-full mt-2 bg-primary-800"
                >
                  {loading ? "Registering..." : "Register Now"}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <a href="sign-in" className="underline underline-offset-4">
                    Sign in
                  </a>
                </div>
              </div>
            </form>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            {success && <p className="text-green-600 mt-4 text-center">{success}</p>}
            {/* if success then redirect user to signin page */}
            {success && (
              redirect("/sign-in")
                  )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}