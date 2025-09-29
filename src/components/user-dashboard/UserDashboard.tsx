//src/components/user-dashboard/UserDashboard.tsx
import React from 'react'
import Navbar from './Navbar'
import Footer from '../home/Footer'
import WelcomeSection from './WelcomeSection'
import BookmarksPage from '@/app/dashboard/bookmarks/page'
import EligibilityChecker from './EligibilityChecker'
import { auth } from '@/utils/actions/auth/auth'
import { SignOut } from '../auth/SignOut'


const UserDashboard = async ({username, name, userId}: {username: string | null, name: string | null, userId: string | null}) => {
  
  return (
    <div>
        <Navbar username={username} />
        <WelcomeSection userName={name || "User"} />
        <EligibilityChecker userId={userId ?? ""} />
        <BookmarksPage/>
        <SignOut/>
        <Footer/>
    </div>
  )
}

export default UserDashboard