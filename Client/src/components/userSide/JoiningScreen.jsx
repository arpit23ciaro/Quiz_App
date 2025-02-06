import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import quizTitleAndPin from '../../services/quizPinAndTitle'
import socket from '../../utils/socket/socket'
import { usePlayQuiz } from '../../context/playQuizContextProvider'

const JoiningScreen = () => {

    const { quizId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [pin, setPin] = useState("");
    const [user, setUser] = useState([]);
    const {setQuizId} = usePlayQuiz();


    useEffect(() => {
        socket.on("update-user-list", (userList) => {
            setUser(userList);
        });
        setQuizId(quizId)
        return () => {
            socket.off("update-user-list");
        }
    }, [])

    useEffect(() => {
        async function getQuizData() {
            const data = await quizTitleAndPin(quizId);
            if (data.data.success) {
                if (data.pin == "")
                    navigate('/')
                else {
                    setPin(data.data.title);
                    setTitle(data.data.pin);
                }
            }
        }
        getQuizData();
    }, [quizId]);

    async function startGame() {
        navigate('/hostQuizPlay');
    }

    return (
        <div className='w-[100vw] h-[94vh] flex flex-col justify-evenly items-center'>
            <div className='flex flex-col bg-[#005A57] w-[60%] p-8 rounded-md text-white gap-3'>
                <p className=' text-sm text-center md:text-start'>Join At:-</p>
                <div className='flex flex-col md:flex-row justify-between gap-4'>
                    <div className='flex flex-col text-white font-bold text-3xl'>
                        <p className='text-center'>QUBIT01</p>
                        <p className='text-center  leading-3'>.COM</p>
                    </div>
                    <div className='flex flex-col'>
                        <p className='text-center text-lg'>You have joined with PIN:</p>
                        <p className='text-center text-2xl font-bold'>{title}</p>
                    </div>
                    <div className='text-center text-lg font-semibold'>{pin}</div>
                </div>
            </div>
            <div className='flex flex-col gap-5'>
            <button 
            onClick={startGame}
            className='bg-black text-white p-2 rounded-md cursor-pointer hover:scale-110 transition-all'>Start Game</button>
                <div className='flex flex-row'>
                {user.length != 0 ? user.map((user, i) => (
                    <div
                        className='p-2 bg-[#005A57] text-white rounded-md'
                        key={i}>{user.username}

                    </div>
                )) :
                    <div className='p-2 bg-[#005A57] text-white rounded-md'>Waiting for the users to join game... </div>
                }
                </div>
            </div>
        </div>
    )
}

export default JoiningScreen