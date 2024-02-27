import React from 'react'
import NavBar from '../features/navbar/Navbar'
import Shop from '../features/product/components/Shop'
import Footer from '../features/common/Footer'

export default function ShopPage() {
  return (
    <div>
        <NavBar>
            <Shop/>
        </NavBar>
        <Footer/>
    </div>
  )
}
