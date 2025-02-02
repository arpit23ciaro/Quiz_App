import React, { useEffect, useState } from 'react'
import { usePlayQuiz } from '../context/playQuizContextProvider'
import allQuestionIds from '../services/userEnd/allQuestionIds';
import socket from '../utils/socket/socket';
import getQuestionDetails from '../services/getQuestionDetails';
import { IoIosArrowForward } from "react-icons/io";
import ScoreBoard from './userSide/ScoreBoard';
import { useNavigate } from 'react-router-dom';
import FinalScoreBoard from './userSide/FinalScoreBoard';

const HostQuizPlayScreen = () => {
  const { quizId } = usePlayQuiz();
  const navigate = useNavigate();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questinIds, setQuestionIds] = useState([]);
  const [questionData, setQuestionData] = useState(null);
  const [scoreCard, setScoreCard] = useState(false);
  const [firstEffectDone, setFirstEffectDone] = useState(false)
  const [time, setTime] = useState(-1);
  const [sortedUser, setSortedUser] = useState([]);


  useEffect(() => {
    if (time != -1) {
      if (time <= 0) {
        setScoreCard(true)
        const roomId = quizId;
        socket.emit("timerEnded", { roomId });
      };
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [time]);

  socket.on("score-card", (sortedUser) => {
    setSortedUser(sortedUser);
  })
  
  useEffect(() => {
    setSortedUser([]);
    setScoreCard(false);
    let ids;
    async function getAllQuestionIds() {
      const data = await allQuestionIds(quizId);
      if (data.data.success) {
        setQuestionIds(data.data.questionIds);
        ids = data.data.questionIds;
      }
    }
    async function getQuestion() {
      let id;
      if (questinIds[questionIndex])
        id = questinIds[questionIndex];
      else {
        id = ids[questionIndex];
      }
      const data = await getQuestionDetails(id);
      if (data.data.success) {
        const questionInfo = data.data.questionData;
        const roomId = quizId;
        setQuestionData(questionInfo);
        setTime(parseInt(questionInfo.duration))
        socket.emit("question-data", { roomId, questionInfo });
      }
    }

    if (questinIds.length == 0) {
      getAllQuestionIds().then(() => getQuestion());
    }
    else
      getQuestion();
  }, [questionIndex])



  return (
    <>
      {
        scoreCard && questinIds.length-1==questionIndex
        ?<FinalScoreBoard userData={sortedUser}/>
        :<div className='w-full  bg-[#00837E] flex flex-col items-center'>
      <nav className="w-full flex justify-between items-center  bg-white shadow-md p-2">
        <span className="font-bold text-lg">QUBIT01.XYZ</span>
        <span className="font-bold text-xl">Quiz Title</span>
        {questinIds.length - 1 != questionIndex ? <div className="flex items-center gap-1 border p-1 rounded-md">
           <button className="text-xl" onClick={() => setQuestionIndex((prev) => prev + 1)}>
            Next
          </button>
          <div className='text-xl'><IoIosArrowForward /></div>
        </div> : <button className=" border p-1 rounded-md" onClick={()=>navigate("/")}>Done</button>}
      </nav>
      {scoreCard && (questinIds.length-1 > questionIndex) ?
        <ScoreBoard userData={sortedUser} />
        : <>
          
          {
            questionData == null ? <div>Loading...</div>
              : <>
              <p className=' border-4 border-l-[#00D9D2] border-t-[#00D9D2] border-r-[#132f56] border-b-[#132f56] flex justify-center items-center p-2 rounded-full text-blue-950 bg-white w-9 h-9 text-center'>{time}</p>
              <div className="flex flex-col justify-center items-center w-full p-2">
                <div className="bg-white rounded-lg p-6 shadow-lg w-[450px]  ">
                  <h2 className="font-bold text-lg mb-4">Question:</h2>
                  <div className="w-full bg-gray-200 p-4 rounded-md mb-4 h-16">{questionData.question}</div>
                  {questionData.questionImg && <img
                    className='ml-[25%]'
                    src={questionData.questionImg} width={200} />}
                  <h3 className="font-bold text-lg mb-2">Answers:</h3>
                  <div className='flex flex-col gap-2'>
                    {questionData.options.map((option, i) => (
                      <div className=" flex flex-col bg-gray-200 p-4 rounded-md justify-center items-center" key={i}>
                        <p>{option.text}</p>
                        {option.optionImg && <img src={option.optionImg} width={150} />}
                      </div>
                    ))}
                  </div>
                  <h2 className="font-bold text-lg mb-4">Question Type:</h2>
                  <div className="w-full bg-gray-200 p-4 rounded-md mb-4 h-16">{questionData.questionType}</div>
                </div>
              </div>
              </>
          }
        </>
      }
    </div>
      }
    </>
  )
}

export default HostQuizPlayScreen