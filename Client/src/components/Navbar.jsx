import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/userAuthContextProvider";
import logout from "../services/logout";

const Navbar = () => {
  const {isAuthenticated,setLoading,setIsAuthenticated,setUser} = useUserAuth();
  const navigate = useNavigate();

   const  logOut = async()=>{
    try{
      setLoading(true);
      const data = await logout();

      if(data.data.success){
        setIsAuthenticated(false);
        setUser(null);
        navigate("/");
      }  
    }
    catch(error){
      console.log("Error in logout api -> ",error)
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <div className=" w-full h-[63px] bg-[#003433] text-white flex justify-between p-2 pl-12 pr-8 fixed top-0 z-100">
      <div className="flex flex-row text-center items-center">
        <p className=" font-extrabold text-2xl">Qubit01</p>
      </div>
      <div className=" hidden md:flex  text-lg  justify-end  pr-5 gap-12 w-[17rem] items-center">
        {!isAuthenticated && <Link to='/'>Home</Link>}
        {!isAuthenticated && <Link to='/signup'>Signup</Link>}
        {!isAuthenticated && <Link to='/login'>Login</Link>}
        {isAuthenticated && <div onClick={()=>logOut()} className=" cursor-pointer">Logout</div>}
      </div>
      <div className="md:hidden flex items-center">
      <GiHamburgerMenu size={35}/>
      </div>
    </div>
  );
};

export default Navbar;
