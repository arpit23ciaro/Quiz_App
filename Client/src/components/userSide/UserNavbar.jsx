import React from 'react'
import { useNavigate } from 'react-router-dom'

const UserNavbar = () => {
  const navigate = useNavigate();
  return (
    <div className='h-[40px] bg-gray-200 flex justify-between p-2'>
      <div className='font-bold text-lg'>Qubit01</div>
      <div className=' cursor-pointer underline text-black' onClick={()=>navigate('/')}>Exit</div>
    </div>
  )
}

export default UserNavbar