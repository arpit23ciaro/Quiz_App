import React, { useEffect, useState } from 'react'
import ProfileSlider from '../components/userSide/ProfileSlider'
import { usePlayQuiz } from '../context/playQuizContextProvider';
import socket from '../utils/socket/socket';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {

    const [imageUrl, setImageUrl] = useState("");
    const [username, setUserName] = useState("");
    const navigate = useNavigate();
    console.log(username)

    const {quizId} = usePlayQuiz();
    

    async function handleSubmit(e) {
        e.preventDefault();
        if(username.trim()!=""){
            const roomId = quizId;
            socket.emit("join-room",{roomId,username,imageUrl});
            navigate('/playQuiz')
        }
    }
    
    return (
        <div className=' w-[100vw] pt-10 flex flex-col'>
            <div className='flex justify-center items-center flex-col gap-9'>
                <p className=' text-white text-2xl font-semibold'>Which image describe you most</p>
                <ProfileSlider setImageUrl={setImageUrl}/>
                <form className='flex flex-col gap-2 items-center' onSubmit={handleSubmit}>
                    <label htmlFor='name' className=' text-white text-lg text-center'>Enter your name</label>
                    <input type='text'
                    onChange={(e)=>setUserName(e.target.value)}
                     name='name' 
                     placeholder='Enter your name'
                     className='w-[300px] border border-white rounded-md bg-inherit focus:border-white focus:outline-none p-1 text-white' />
                     <button type='submit' className='w-[150px] text-center bg-[#003433] text-white rounded-md p-1'>Start</button>
                </form>
            </div>
        </div>
    )
}

export default UserProfile