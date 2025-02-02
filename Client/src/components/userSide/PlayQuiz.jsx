import React, { useEffect, useState } from 'react'
import { usePlayQuiz } from '../../context/playQuizContextProvider'
import socket from '../../utils/socket/socket';
import { useLocation } from 'react-router-dom';
import getScore from '../../services/userEnd/getScore';
import ScoreBoard from './ScoreBoard';

const PlayQuiz = () => {

  const { userId, quizId } = usePlayQuiz();
  const [question, setQuestion] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState([]);
  const location = useLocation();
  const [time, setTime] = useState(-1);
  const [scoreCard, setScoreCard] = useState(false);
  const [sortedUser, setSortedUser] = useState([])

  useEffect(() => {
    setScoreCard(false);
    setSortedUser([]);
    socket.on('update-question', (question) => {
      setQuestion(question);
      setTime(parseInt(question.duration))
    })
  }, [question])



  useEffect(() => {
    if (time != -1) {
      if (time <= 0) {
        setScoreCard(true);
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


  function handleSelect(id) {
    setSelectedAnswer((prev) => {
      if (question.questionType === "Single choice") {
        return [id];
      } else {
        return prev.includes(id)
          ? prev.filter((answer) => answer !== id)
          : [...prev, id];
      }
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (selectedAnswer.length != 0) {
      const data = await getScore(question._id, selectedAnswer, time);
      if (data.data.success) {
        const roomId = quizId;
        const userId = socket.id;
        const score = data.data.score;
        socket.emit("update-user", { roomId, userId, score })
      }
    }
  }


  return (
    <>
      {scoreCard ? <ScoreBoard userData={sortedUser}/>
        : <form className='flex justify-center items-center gap-2 mt-2'>
          {
            question.length == 0 ? <div className='p-2 bg-[#005A57] text-white rounded-md mt-[100px]'>Waiting for the host to Start game</div>
              : <div className='flex flex-col gap-4 items-center'>
                <p className=' border-4 border-l-[#00D9D2] border-t-[#00D9D2] border-r-[#132f56] border-b-[#132f56] flex justify-center items-center p-2 rounded-full text-blue-950 bg-white w-9 h-9 text-center'>{time}</p>
                <div className='bg-white mt-2 w-[450px] p-2 rounded-lg flex flex-col gap-2'>
                  <p className=' text-lg font-bold'>Question:</p>
                  <div className='bg-[#7fc7c5] rounded-md p-1 break-words'>{question.question}?</div>
                  {question.questionImg && <img src={question.questionImg} width={200} className=' m-auto' />}
                  <div className='flex justify-between'>
                    <p className=' text-lg font-bold'>Options:</p>
                    <p className='font-semibold'>{question.questionType}</p>
                  </div>
                  {question.options.map((option, i) => {
                    const select = selectedAnswer.includes(option._id)
                    return (<div
                      key={i}
                      onClick={() => handleSelect(option._id)}
                      className={` bg-[#7fc7c5] rounded-md p-1 break-words cursor-pointer ${select && "border-2 border-blue-600"}`}>
                      <p>{option.text}</p>
                      {option.optionImg && <img src={option.optionImg} width={150} className=' m-auto' />}
                    </div>
                    )
                  })}
                  <button type='submit' className=' bg-[#005A57] p-2 rounded-md text-white' onClick={handleSubmit}>Submit</button>
                </div>
              </div>

          }
        </form>}
    </>
  )
}

export default PlayQuiz