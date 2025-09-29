import Footer from '@/components/home/Footer'
import Navbar from '@/components/user-dashboard/Navbar'
import ProfileCard from '@/components/user-dashboard/ProfileCard'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar username={null} />
        <div className='max-w-4xl h-[70vh] mx-auto mt-20 mb-10'>
            <ProfileCard/>
        </div>
        <Footer/>
    </div>
  )
}

export default page