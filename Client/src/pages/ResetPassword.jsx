import React, { useState } from 'react'
import Button from '../components/Button'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserAuth } from '../context/userAuthContextProvider';
import resetPassword from '../services/resetPassword';
import { regex } from '../utils/constants/regex';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { loading, setLoading } = useUserAuth();
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);

  const validationSchema = Yup.object({
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
  });

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      const data = await resetPassword(token, values.password);
      if (data && data.success) {
        setSubmitting(false);
        resetForm();
        navigate('/login');
      }
    }
    catch (error) {
      console.log("Error in resetPassword api -> ", error);
    }
    finally {
      setLoading(false)
    }
  };
  return (
    <div className='flex  justify-center mt-16'>
      <div className=' bg-white h-[14rem] rounded-md w-[70%] md:w-[400px]'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        > {({ isSubmitting }) => (
          <Form className=' bg-white rounded-md flex flex-col  p-4 gap-2 '>
            <h2 className='text-black text-3xl text-center'>Reset Password</h2>
            <div className='flex flex-col'>
              <label htmlFor='password'>Password</label>
              <div className='relative'>
                <Field type={toggle1 ? 'text' : 'password'} name='password' className='bg-[#C7C7C7] focus:outline-none rounded-lg p-1 w-full' placeholder='Enter your Password' />
                {
                  toggle1 ? <IoEyeOffOutline size={25} className=' absolute right-5 top-1 cursor-pointer' onClick={() => setToggle1((prev) => !prev)} /> : <IoEyeOutline size={25} className=' absolute right-5 top-1 cursor-pointer' onClick={() => setToggle1((prev) => !prev)} />
                }
              </div>
              <ErrorMessage name="name" component="div" className="text-red-500" />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <div className='relative'>
                <Field type={toggle2 ? 'text' : 'password'} name='confirmPassword' className='bg-[#C7C7C7] focus:outline-none rounded-lg p-1 w-full' placeholder='Enter your Confirm Password' />
                {
                  toggle2 ? <IoEyeOffOutline size={25} className=' absolute right-5 top-1 cursor-pointer' onClick={() => setToggle2((prev) => !prev)} /> : <IoEyeOutline size={25} className=' absolute right-5 top-1 cursor-pointer' onClick={() => setToggle2((prev) => !prev)} />
                }
              </div>

              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>
            <Button text='Submit' isSubmitting={isSubmitting} />
          </Form>
        )}</Formik>
      </div>
    </div>
  )
}

export default ResetPassword