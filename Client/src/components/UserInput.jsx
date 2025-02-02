import React, { useState } from "react";
import { usePlayQuiz } from "../context/playQuizContextProvider";
import { useNavigate } from "react-router-dom";
import checkValidPin from "../services/userEnd/validPin";

const UserInput = () => {
  const [pin, setPin] = useState();
  const navigate = useNavigate();
  const {setQuizId} = usePlayQuiz();
  function handleInput(e) {
    let value = e.target.value;
    if(/^\d{0,6}$/.test(value)){
        setPin(value)
    }
  }

async function submitPinHandler(e){
  e.preventDefault();
  try{
    const data = await checkValidPin(pin);
    if(data.data.success){
      setQuizId(data.data.quizId);
      navigate('/userProfile')
    }
    else{
      console.log("invalid pin");
    }
  }
  catch(error){
    console.log(error);
  }
}
  return (
    <>
      <form className="mt-9 flex flex-col gap-3 items-center justify-center md:flex-row" onSubmit={submitPinHandler}>
        <div className=" bg-[#FFFFFF] rounded-full p-3 w-[100%] text-center">
          <label>Join Game?Enter Your Pin:</label>
          <input
            className=" ml-3 text-center rounded-full bg-[#DEE3E2] focus:outline-none w-36 p-2"
            placeholder="123456"
            onInput={handleInput}
            value={pin}
          />
        </div>
        <button type="submit" className=" p-1 w-[6rem] border mt-2 text-white rounded-md font-semibold bg-[#9A9A9A]">Submit</button>
      </form>
    </>
  );
};

export default UserInput;
