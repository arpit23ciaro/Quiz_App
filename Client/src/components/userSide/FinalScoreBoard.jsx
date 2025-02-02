import React from 'react'
import { FaCrown } from "react-icons/fa";
import UserScore from './UserScore';
import { useNavigate } from 'react-router-dom';

const FinalScoreBoard = ({ userData }) => {
    const navigate = useNavigate();
    return (
        <div className='h-[100vh] w-[100vw] relative'>
            <div className='absolute right-2 text-white underline cursor-pointer' onClick={()=>navigate("/")}>Exit</div>
            <div className='h-[30%] flex flex-row justify-center  gap-4 md:gap-16'>
                <div className='flex flex-col items-center relative mt-14 gap-0'>
                    <div className='border-2 border-black rounded-[50%] w-24 h-24'>
                        {userData[1] && <img src={userData[1].imageUrl} className='rounded-[50%] w-[93px] h-[93px]'/>}
                    </div>
                    <div className='w-3 h-3 bg-black rounded-full relative bottom-2'></div>
                    {userData[1] && <div  className='text-white'>{userData[1].username}</div>}
                </div>

                <div className='flex flex-col items-center relative  gap-0'>
                    <FaCrown color='#FFD912' size={24} className=''
                    />
                    <div className='border-2 border-[#FFD912] rounded-[50%] w-24 h-24'>
                        {userData[0] && <img src={userData[0].imageUrl} className='rounded-[50%] w-[93px] h-[93px]' />}
                    </div>
                    <div className='w-3 h-3 bg-[#FFD912] rounded-full -top-2 relative '></div>
                    {userData[0] && <div className='text-white'>{userData[0].username}</div>}
                </div>

                <div className='flex flex-col items-center relative mt-14 gap-0'>
                    <div className='border-2 border-black rounded-[50%] w-24 h-24 relative'>
                        {userData[2] && <img src={userData[2].imageUrl} className='rounded-[50%] w-[93px] h-[93px]' />}
                    </div>
                    <div className='w-3 h-3 bg-black rounded-full relative bottom-2'></div>
                    {userData[2] && <div  className='text-white'>{userData[2].username}</div>}
                </div>
            </div>
            <div className='h-[70%] bg-gray-200 rounded-t-[50%] flex justify-center p-24  md:pt-12'>

                <div className='flex flex-col gap-1'>
                    {
                        userData.slice(3).map((user, i) => (
                            <UserScore user={user} key={i+3} index={i + 4} />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default FinalScoreBoard