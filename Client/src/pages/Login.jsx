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
      const data = await login(values.email, values.password);
      if (data.data.success) {
        setSubmitting(false);
        resetForm();
        navigate(`/dashboard/${data.data.id}`);
      }
    } catch (error) {
      console.log("Error in login api -> ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col md:flex-row justify-center items-center mt-16'>
      <img src={img1} className='hidden md:flex' alt="Login Illustration" />
      <div>
        
      </div>
    </div>
  )
}

export default Login