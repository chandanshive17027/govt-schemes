import Footer from '@/components/home/Footer'
import Navbar from '@/components/home/Navbar'
import SchemesPage from '@/components/schemes/AllSchemes'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
        <SchemesPage/>
        <Footer/>
    </div>

  )
}

export default page