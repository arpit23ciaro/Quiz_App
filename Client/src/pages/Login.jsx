import React, { useState } from 'react'
import img1 from '../assets/login-removebg-removebg-preview.png'
import login from '../services/login'
import Button from '../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc";
import { regex } from '../utils/constants/regex';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { useUserAuth } from '../context/userAuthContextProvider'

const Login = () => {

  const [toggle, setToggle] = useState(false);
  const { setLoading, loading, setToken, setSignupData } = useUserAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .matches(
        regex.email,
        "Email must follow standard email format"
      ),
    password: Yup.string()
      .required("Password is required")
      .test("uppercase", "Password must contain at least one uppercase letter", (value) =>
        regex.uppercase.test(value || "")
      )
      .test("lowercase", "Password must contain at least one lowercase letter", (value) =>
        regex.lowercase.test(value || "")
      )
      .test("number", "Password must contain at least one number", (value) =>
        regex.number.test(value || "")
      )
      .test("specialChar", "Password must contain at least one special character", (value) =>
        regex.specialCharacter.test(value || "")
      )
      .test(
        "length",
        "Password must be between 8 and 15 characters",
        (value) => (value || "").length >= 8 && (value || "").length <= 15
      )
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      const data = await login(values.email, values.password)
      if (data.data.success) {
        setSubmitting(false);
        resetForm();
        navigate(`/dashboard/${data.data.id}`);
      }
    }
    catch (error) {
      console.log("Error in login api -> ", error)
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <div className='flex flex-col md:flex-row justify-center items-center mt-16'>
      <img src={img1} className='hidden md:flex' />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      > {({ isSubmitting }) => (
        <div>
          Login page
          {/* <Form className=' bg-white rounded-md w-[70%] flex flex-col  p-4 gap-2 md:w-[30%]'>
          <h2 className='text-black text-3xl text-center'>Login</h2>
          <div className='flex flex-col'>
            <label htmlFor='email'>Email</label>
            <Field type='email' name='email' className='bg-[#C7C7C7] focus:outline-none rounded-lg p-1' placeholder='Enter your email' />
            <ErrorMessage name="email" component="div" className="text-red-500" />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='password'>Password</label>
            <div className='relative'>
              <Field type={toggle?'text':'password'} name='password' className='bg-[#C7C7C7] focus:outline-none  rounded-lg p-1 w-full' placeholder='Enter your password' />
              {
                toggle ? <IoEyeOffOutline size={25} className=' absolute right-5 top-1 cursor-pointer' onClick={() => setToggle((prev) => !prev)} /> : <IoEyeOutline size={25} className=' absolute right-5 top-1 cursor-pointer' onClick={() => setToggle((prev) => !prev)} />
              }
            </div>

            <ErrorMessage name="password" component="div" className="text-red-500" />
          </div>
          <Link to='/forgot-password' className=' text-red-500 text-sm underline'>Forgot password</Link>
          <Button text='Submit' isSubmitting={isSubmitting} />
          <p className=' self-center text-sm'>New User? <Link to='/signup' className=' underline text-blue-600'>Sign In</Link></p>
          <FcGoogle className=' self-center mt-3 cursor-pointer' size={30} onClick={()=> window.location.href = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/google`}/>
        </Form> */}
        </div>
      )}
      </Formik>
    </div>
  )
}

export default Login