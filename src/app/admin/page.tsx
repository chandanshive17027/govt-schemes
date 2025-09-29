import Navbar from '@/components/admin-dashboard/Navbar'
import SchemesData from '@/components/admin-dashboard/SchemesData'
import UserCardDashboard from '@/components/admin-dashboard/UsersCard'
import Footer from '@/components/home/Footer'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <div className='min-h-screen pt-16'>
        <h1 className='text-3xl font-bold text-center mt-10'>Admin Dashboard</h1>
        <div className='max-w-7xl mx-auto px-6 lg:px-12 mt-10 flex flex-col gap-6'>
          {/* Added flex-col and gap-6 */}
          <SchemesData/>
          <UserCardDashboard/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default page
