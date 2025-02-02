import React, { useState } from 'react'
import { useUserAuth } from '../context/userAuthContextProvider';
import { useNavigate } from 'react-router-dom';
import forgotPassword from '../services/forgotPassword';


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const { loading, setLoading } = useUserAuth();
    const [sendEmail, setSendEmail] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!sendEmail) {
            setLoading(true);
            try {
                const res = await forgotPassword(email);
                if (res && res.data && res.data.success) {
                    setSendEmail(true);
                }
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
        } else {
            navigate("../login");
        }
    };
    return (
        <div className='flex  justify-center mt-16'>
            <div className=' bg-white h-[14rem] rounded-md w-[70%] md:w-[400px]'>
                <form className=' bg-white rounded-md flex flex-col  p-4 gap-2' onSubmit={handleSubmit}>
                    <h2 className='text-black text-3xl text-center'>Forgot Password</h2>
                    {
                        !sendEmail ? <><label>Email</label>
                            <input 
                            value={email} 
                            type='text' 
                            className='bg-[#C7C7C7] focus:outline-none rounded-lg p-1' 
                            placeholder='Enter your email' 
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </>
                            : <div className=" text-green-500 text-center">
                                <p>Sent mail Successfully</p>
                                <p>Please check your email.</p>
                            </div>
                    }
                    <div className="w-full">
                        <button
                            type="submit"
                            className=" bg-black w-full p-2 rounded-lg text-white cursor-pointer"
                        >
                            {loading ? "Loading" : sendEmail ? "Back" : "Continue"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default ForgotPassword