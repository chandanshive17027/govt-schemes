//src/app/dashboard/page.tsx
import UserDashboard from '@/components/user-dashboard/UserDashboard'
import { auth } from '@/utils/actions/auth/auth'
import React from 'react'

const page = async () => {

  const session = await auth();
  if (!session?.user.id){
    return <div>Unauthorized</div>
  }

  const userId = session.user.id;
  const username = getInitials(session.user.name ?? "")

  return (
    <div>
      <UserDashboard userId={userId} username={username} name={username} />
    </div>
  )
}

export default page

// Get initials from name
const getInitials = (name: string) => {
  if (!name) return "U"; 
  const names = name.trim().split(" ");
  if (names.length === 1) return names[0][0].toUpperCase();
  return (names[0][0] + names[1][0]).toUpperCase();
};
