import React from "react";
import UserInput from "../components/UserInput";
import UserCard from "../components/UserCard";

const Home = () => {
  return (
    <div className="bg-[#00837E]  flex flex-col items-center">
      <div className="flex flex-col gap-7  items-center ">
        <UserInput />
        <UserCard />
      </div>
    </div>
  );
};

export default Home;
