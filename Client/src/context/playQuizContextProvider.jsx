import { useContext, useEffect, useState } from "react";
import playQuizContext from "./playQuizContext";

export default function PlayQuizContextProvider({ children }) {
  const [quizId, setQuizId] = useState("");
  const [userId, setUserId] = useState("");
 
  return (
    <playQuizContext.Provider
      value={{
        quizId,
        setQuizId,
        userId,
        setUserId
      }}
    >
      {children}
    </playQuizContext.Provider>
  );
}

export function usePlayQuiz() {
  return useContext(playQuizContext);
}
