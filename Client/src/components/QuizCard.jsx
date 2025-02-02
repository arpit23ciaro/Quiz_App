import React from 'react'
import noimage from '../assets/noimage.png'
import { useNavigate } from 'react-router-dom'
import { useUserAuth } from '../context/userAuthContextProvider';
import deleteQuiz from '../services/deleteQuiz';
import { date } from 'yup';
import playQuiz from '../services/playQuiz';
import socket from '../utils/socket/socket';

const QuizCard = ({data,setQuizes}) => {
    const navigate = useNavigate();
    const {setLoading,setTitle} = useUserAuth();
    async function handleDelete(){
        try{
            setLoading(true);
            const res = await deleteQuiz(data._id);
            
            if(res.data.success){
                setQuizes((prevQuizes) =>
                    prevQuizes.filter((quiz) => quiz._id!==data._id)
                  );
            }
        }
        catch(error){
            console.log(error);
        }
        finally{
            setLoading(false);
        }
    }

    async function handlePlay() {
        try{
            setLoading(true);
            const data2 = await playQuiz(data._id);
            if(data2 && data2.data.success){
                socket.emit("create-room",data._id);
                navigate(`/userJoining/${data._id}`)
            }
        }
        catch(error){
            console.log(error)
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className='flex flex-col p-2 rounded-lg w-[300px] bg-white'>
            <div>{data.title}</div>
            <div className='flex flex-row justify-evenly'>
                <button className='border-2 p-1 rounded-md bg-' onClick={()=>{setTitle(data.title); navigate(`/myQuiz/${data._id}`)}}>Edit Quiz</button>
                <button className='border-2 p-1 rounded-md' onClick={handlePlay}>Play Now</button>
                <button className='border-2 p-1 rounded-md' onClick={()=> handleDelete()}>Delete</button>
            </div>
        </div>
    )
}

export default QuizCard