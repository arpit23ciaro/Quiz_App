import React, { useState } from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom';

const QuizTitle = () => {
    const [title,setTitle] = useState("");
    const navigate = useNavigate();
    async function onSubmit(e){
        e.preventDefault();
        try{
            const res = await createQuiz(title);
            if(res.data.success){
                navigate('myQuiz');
            }
        }
        catch(error){
            console.log(error)
        }
    }
  return (
    <div className='flex  justify-center mt-16'>
        <form className='flex flex-col bg-white w-[300px] p-2 rounded-md gap-2'>
        <label htmlFor='quizTitle' className=' text-center font-semibold'>Enter the Quiz Title</label>
        <input type='text' 
        name='quizTitle' 
        id='quizTitle'
        value={title}
        onChange={(e)=>setTitle(e.target.value)}  
        className='border border-gray-400 focus:outline-none rounded-md focus:border-gray-500 p-1' />
        <Button text='Create' type='submit' />
    </form>
    </div>
  )
}

export default QuizTitle