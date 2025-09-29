"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
}

export default function UserCardDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/allusers"); // API returns all users
        const data = await res.json();
        setUsers(data.slice(0, 4)); // show only 4 users
        setTotal(data.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading users...</p>;

  return (
    <Card className="p-6">
      {/* Header with title and See All button */}
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Total Users: <span className="font-semibold">{total}</span>
          </CardDescription>
        </div>

        <Link
          href="/admin/allusers"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
        >
          See All
        </Link>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.map((user) => (
            <Card
              key={user.id}
              className="border hover:shadow-lg transition cursor-pointer"
            >
              <CardHeader>
                <CardTitle className="text-sm">{user.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-1">
                <p>{user.email}</p>
                {user.age && <p>Age: {user.age}</p>}
                {user.gender && <p>Gender: {user.gender}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
