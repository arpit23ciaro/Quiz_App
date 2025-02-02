import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUserAuth } from '../context/userAuthContextProvider';
import UserCard from '../components/UserCard';
import QuizSlider from '../components/QuizSlider';
import allQuiz from '../services/allQuiz';

const Dashboard = () => {
  const { userId } = useParams();
  const { user, setUser, setLoading,setTitle } = useUserAuth();
  const [quizes, setQuizes] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await allQuiz();
        if (data.data.success) {
          setQuizes(data.data.data)
        }
      }
      catch (error) {
        console.log(error)
      }
      finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user])
  return (
    <div className="bg-[#00837E]  flex flex-col items-center gap-8 ml-4 mr-4">
      <div className="flex flex-col gap-7  items-center mt-4">
        <UserCard setQuizes={setQuizes}/>
      </div>
      <div className=' font-semibold text-2xl text-white pl-5'>My Library</div>
      <QuizSlider quizes={quizes} setQuizes={setQuizes}/>
    </div>
  )
}

export default Dashboard