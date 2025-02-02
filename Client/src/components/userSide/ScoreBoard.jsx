import React from 'react'
import UserScore from './UserScore'

const ScoreBoard = ({userData}) => {
  return (
    <div className='flex flex-col items-center h-[86vh] w-[100vw] mt-10 gap-5'>
        <p className=' text-white text-2xl font-semibold'>ScoreBoard</p>
        <div className='flex flex-col gap-1'>
        {
          userData.map((user,i) => (
            <UserScore user={user} key={i} index={i+1}/>
          ))
        }
        </div>
    </div>
  )
}

export default ScoreBoard