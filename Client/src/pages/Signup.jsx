import React, { useState } from 'react'
import img1 from '../assets/login-removebg-removebg-preview.png'
import Button from '../components/Button'
import { FcGoogle } from 'react-icons/fc'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { regex } from '../utils/constants/regex'
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import signup from '../services/signup'
import { useUserAuth } from '../context/userAuthContextProvider'

const Signup = () => {

  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const navigate = useNavigate();

  const {loading ,setLoading} = useUserAuth();

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(regex.name, 'Please enter valid name')
      .max(40)
      .required(),
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
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    consent: Yup.boolean()
      .oneOf([true], "You must accept the terms and conditions"),
  });

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    consent: false,
  };

  const handleSubmit =  async(values, { setSubmitting, resetForm }) => {
    // console.log("Form values:", values);
    try{
      setLoading(true);
      const data = await signup(values.name, values.email, values.password)
      if(data.data.success){
        setSubmitting(false);
        resetForm();
        navigate('/login');
      }
      
    }
    catch(error){
      console.log("Error in signup api -> ",data.message)
    }
    finally{
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
        <Form className=' bg-white rounded-md w-[70%] flex flex-col  p-4 gap-2 md:w-[30%]'>
          <h2 className='text-black text-3xl text-center'>Create Account</h2>

          <div className='flex flex-col'>
            <label htmlFor='name'>Name</label>
            <Field type='text' name='name' className='bg-[#C7C7C7] focus:outline-none rounded-lg p-1' />
            <ErrorMessage name="name" component="div" className="text-red-500" />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='email'>Email</label>
            <Field type='email' name='email' className='bg-[#C7C7C7] focus:outline-none rounded-lg p-1' />
            <ErrorMessage name="email" component="div" className="text-red-500" />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='password'>Password</label>
            <div className='relative'>
              <Field type={toggle1 ? 'text' : 'password'} name='password' className='bg-[#C7C7C7] focus:outline-none  rounded-lg p-1 w-full' />
              {
                toggle1 ? <IoEyeOffOutline size={25} className=' absolute right-5 top-1 cursor-pointer' onClick={() => setToggle1((prev) => !prev)} /> : <IoEyeOutline size={25} className=' absolute right-5 top-1 cursor-pointer' onClick={() => setToggle1((prev) => !prev)} />
              }
            </div>
            <ErrorMessage name="password" component="div" className="text-red-500" />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='confirmPassword'>Confirm-Password</label>
            <div className='relative'>
              <Field type={toggle2 ? 'text' : 'password'} name='confirmPassword' className='bg-[#C7C7C7] focus:outline-none  rounded-lg p-1 w-full' />
              {
                toggle2 ? <IoEyeOffOutline size={25} className=' absolute right-5 top-1 cursor-pointer' onClick={() => setToggle2((prev) => !prev)} /> : <IoEyeOutline size={25} className=' absolute right-5 top-1 cursor-pointer' onClick={() => setToggle2((prev) => !prev)} />
              }
            </div>
            <ErrorMessage name='confirmPassword' component='div' className=' text-red-500' />
          </div>

          <div className='flex flex-col'>
            <label>
              <Field type="checkbox" name="consent" />
              I accept the terms and conditions
            </label>
            <ErrorMessage name="consent" component="div" className="text-red-500" />
          </div>

          <Button text='Submit' isSubmitting={isSubmitting} />
          <p className=' self-center text-sm'>New User? <Link to='/login' className=' underline text-blue-600'>Sign In</Link></p>
          <FcGoogle className=' self-center mt-3 cursor-pointer' size={30} onClick={() => window.location.href = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/auth/google`} />
        </Form>
        </div>
      )}</Formik>

    </div>
  )
}

export default Signup