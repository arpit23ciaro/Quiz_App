import React from 'react'

const UserScore = ({user ,index}) => {
  return (
    <div className=' bg-white rounded-md flex flex-row w-[300px] md:w-[400px] p-2 items-center gap-1'>
        <p>{index}</p>
        <img src={user.imageUrl} className='rounded-[50%] w-10 h-8'/>
        <p className=' text-center w-full'>{user?.username}</p>
        <p>{user?.score}</p>
    </div>
  )
}

export default UserScore