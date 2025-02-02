import React from 'react'
import homepage from '../assets/homepage.png'
import { useUserAuth } from '../context/userAuthContextProvider'
import createQuiz from '../services/createQuiz'
import { useNavigate } from 'react-router-dom'

const UserCard = ({setQuizes}) => {
  const { isAuthenticated, setLoading } = useUserAuth();
  const navigate = useNavigate();
  const createquiz = async () => {
    if(!isAuthenticated)
      navigate("/login")
    try {
      setLoading(true);
      const data = await createQuiz();
      if (data.data.success) {
        setQuizes((prev) =>[...prev,data.data]);
        navigate(`/myquiz/${data.data.data._id}`);
      }
    }
    catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false);
    }
  }
  return (
    <div className='h-[380px] w-[320px] md:w-[450px]  bg-white rounded-lg flex flex-col items-center p-2 gap-3'>
      <img src={homepage} width={200} />
      <div className='flex flex-col items-center'>
        <p className=' text-3xl font-semibold'>CREATE A QUIZ </p>
        <p className=' text-xl'>Play with your friends and family</p>
      </div>
      <button className=' w-52 border p-2 bg-[#9A9A9A] text-white text-xl rounded-lg cursor-pointer' onClick={() => createquiz()}>Create Quiz</button>
    </div>
  )
}

export default UserCard