// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Footer from "../home/Footer";
import Navbar from "./Navbar";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    age: "",
    gender: "",
    castecategory: "",
    occupation: "",
    income: "",
    state: "",
    city: "",
    zipCode: "",
    maritalStatus: "",
    education: "",
    preferredLanguage: "",
  });

  // Fetch user details on mount
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();

      setFormData({
        name: data.name || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber?.toString() || "",
        age: data.age?.toString() || "",
        gender: data.gender || "",
        castecategory: data.castecategory || "",
        occupation: data.occupation || "",
        income: data.income?.toString() || "",
        state: data.state || "",
        city: data.city || "",
        zipCode: data.zipCode?.toString() || "",
        maritalStatus: data.maritalStatus || "",
        education: data.education || "",
        preferredLanguage: data.preferredLanguage || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Error fetching profile. Please try again.");
    } finally {
      setLoading(false); // ✅ important: stop loading
    }
  };

  fetchProfile();
}, []); // removed toast from dependencies


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert Int fields
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        income: formData.income ? parseInt(formData.income) : null,
        zipCode: formData.zipCode ? parseInt(formData.zipCode) : null,
        phoneNumber: formData.phoneNumber ? parseInt(formData.phoneNumber) : null,
      };

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

     if (!res.ok) {
  const errorText = await res.text();
  console.error("Profile update failed:", errorText);
  throw new Error(`Failed to update profile: ${errorText}`);
}

      const data = await res.json();

      toast.success("Profile updated successfully!");
      toast.success("Eligible schemes have been sent to your Email!");

      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-blue-900 dark:text-blue-200">Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex mt-15 justify-center items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-4xl shadow-lg border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-200 text-2xl font-bold">
              Update Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      onValueChange={(val) =>
                        setFormData({ ...formData, gender: val })
                      }
                      value={formData.gender}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select
                      onValueChange={(val) =>
                        setFormData({ ...formData, maritalStatus: val })
                      }
                      value={formData.maritalStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Education & Work */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
                  Education & Occupation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="Enter your education level"
                    />
                  </div>

                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="Enter your occupation"
                    />
                  </div>

                  <div>
                    <Label htmlFor="income">Annual Income</Label>
                    <Input
                      type="number"
                      id="income"
                      name="income"
                      value={formData.income}
                      onChange={handleChange}
                      placeholder="Enter your family income"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
                  Location Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="Enter your area zip code"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
                  Preferences
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="castecategory">Caste Category</Label>
                    <Input
                      id="castecategory"
                      name="castecategory"
                      value={formData.castecategory}
                      onChange={handleChange}
                      placeholder="General / OBC / SC / ST"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredLanguage">
                      Preferred Language
                    </Label>
                    <Input
                      id="preferredLanguage"
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleChange}
                      placeholder="e.g. English / Hindi / Marathi"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
