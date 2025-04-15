import React from 'react'
import UpperSection from './UpperSection'
import LowerSection from './LowerSection'

const Footer = () => {
  return (
    <div className='flex flex-col items-center w-screen text-gray-800/85'>
      <UpperSection />
      <div className='w-[90vw] h-[1px] bg-gray-800/15 '></div>
      <LowerSection />
    </div>
  )
}

export default Footer