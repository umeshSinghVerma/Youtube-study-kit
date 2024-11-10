import React from 'react'
import LogoSection from './HeaderComponents/LogoSection'
import SearchSection from './HeaderComponents/SearchSection'
import UserSection from './HeaderComponents/UserSection'

export default function Header() {
  return (
    <div className='flex justify-between items-center h-full px-4'>
      <LogoSection/>
      <SearchSection/>
      <UserSection/>
    </div>
  )
}
