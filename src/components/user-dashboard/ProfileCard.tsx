// src/components/user-dashboard/ProfileCard.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Languages,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface User {
  name?: string;
  email?: string;
  phoneNumber?: string;
  age?: string | number;
  gender?: string;
  occupation?: string;
  education?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  castecategory?: string;
  preferredLanguage?: string;
  maritalStatus?: string;
  image?: string;
}
export default function ProfileCard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto p-6">
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Loading profile...
        </p>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto p-6">
        <p className="text-gray-600 dark:text-gray-300 text-center">
          No profile found. Please update your details.
        </p>
      </Card>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="w-20 h-20">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <CardTitle className="mt-4 text-xl font-bold text-blue-900 dark:text-blue-200">
          {user.name || "No Name"}
        </CardTitle>
        {user.occupation && (
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <Briefcase className="w-4 h-4" /> {user.occupation}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Additional Info */}
        <div className="flex flex-wrap gap-2 mt-3">
          {user.gender && <Badge>{user.gender}</Badge>}
          {user.age && <Badge>{user.age} yrs</Badge>}
          {user.maritalStatus && <Badge>{user.maritalStatus}</Badge>}
          {user.castecategory && <Badge>{user.castecategory}</Badge>}
          {user.preferredLanguage && (
            <Badge className="flex items-center gap-1">
              <Languages className="w-3 h-3" /> {user.preferredLanguage}
            </Badge>
          )}
        </div>
        {/* Contact Info */}
        <div className="space-y-2">
          {user.email && (
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Mail className="w-4 h-4" /> {user.email}
            </p>
          )}
          {user.phoneNumber && (
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Phone className="w-4 h-4" /> {user.phoneNumber}
            </p>
          )}
        </div>

        {/* Location */}
        {(user.city || user.state) && (
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <MapPin className="w-4 h-4" />{" "}
            {[user.city, user.state, user.zipCode].filter(Boolean).join(", ")}
          </p>
        )}

        {/* Education */}
        {user.education && (
          <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <GraduationCap className="w-4 h-4" /> {user.education}
          </p>
        )}

        {/* Update Profile Button */}
        <Button variant={"default"} onClick={() => router.push('/dashboard/profile')} className="bg-blue-900">
          Update Profile
        </Button>
      </CardContent>
    </Card>
  );
}
